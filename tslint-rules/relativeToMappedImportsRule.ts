import * as ts from 'typescript';
import * as Lint from 'tslint';
import * as tsutils from 'tsutils';
import { join as joinPath, dirname as getDirname } from 'path';

interface Options {
    allowSiblings: boolean;
    platformRemapFn: (string) => string;
}

const OPTION_ALLOW_SIBLINGS = 'allow-siblings';

const FAILURE_BODY_RELATIVE = 'module is being loaded from a relative path. Please use an absolute path';
const FAILURE_BODY_SIBLINGS =
    'module path starts with reference to parent directory. Please use an absolute path or sibling files/folders';
const FAILURE_BODY_INSIDE = 'module path should not contain reference to current or parent directory inside';

// Looks for path separator `/` or `\\`(Windows style)
// followed than one or two dot characters
// followed by path separator (same as initial).
const illegalInsideRegex = /(\/|\\)\.\.?\1/;

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: any = {
        ruleName: 'relative-to-mapped-imports',
        type: 'maintainability',
        description: 'Do not use relative paths when importing external modules or ES6 import declarations',
        options: {
            type: 'array',
            items: {
                type: 'string',
                enum: [OPTION_ALLOW_SIBLINGS]
            },
            minLength: 0,
            maxLength: 1
        },
        optionsDescription: `One argument may be optionally provided: \n\n' +
            '* \`${OPTION_ALLOW_SIBLINGS}\` allows relative imports for files in the same or nested folders.`,
        typescriptOnly: false,
        issueClass: 'Ignored',
        issueType: 'Warning',
        severity: 'Low',
        commonWeaknessEnumeration: '710'
    };

    // public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    //     return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions()));
    // }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        return this.applyWithFunction(sourceFile, walk, this.parseOptions(this.getOptions(), program));
    }

    private parseOptions(options: Lint.IOptions, program: ts.Program): Options {
        const compilerOptions = program.getCompilerOptions();

        let baseUrl = compilerOptions.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        const paths = compilerOptions.paths;
        const mapping = Object.keys(paths)[0].replace('*', '');

        const entries = Object.entries(paths);

        const isMobileMapping = (path: string) =>
            ['tns', 'android', 'ios'].some(platform => path.includes(platform));
        const isWebMapping = (path: string) => path.includes('web');

        const platformEntry = entries.find(entry => {
            const platforms = entry[1];
            if (platforms.some(platform =>
                isMobileMapping(platform) || isWebMapping(platform)
            )) {
                // entry[0] -> @src/*
                // entry[1] -> [src/*.web, src/*]
                return true;
            }
        });

        const platformRemapFn = (relativePath) => {
            const basePath = joinPath(baseUrl, platformEntry[1][0].substr(0, platformEntry[1][0].indexOf('*')));
            return relativePath.replace(basePath, platformEntry[0].substr(0, platformEntry[0].indexOf('*')));
        };

        return {
            allowSiblings: options.ruleArguments.indexOf(OPTION_ALLOW_SIBLINGS) > -1,
            platformRemapFn,
        };
    }
}

function walk(ctx: Lint.WalkContext<Options>) {
    const dirname = getDirname(ctx.sourceFile.fileName);
    const { allowSiblings, platformRemapFn } = ctx.options;

    function getValidationErrorBody(expression: ts.Expression): string | undefined {
        if (tsutils.isStringLiteral(expression)) {
            const path = expression.text;

            // when no siblings allowed path cannot start with '.' (relative)
            if (!allowSiblings && path[0] === '.') {
                return FAILURE_BODY_RELATIVE;
            }

            // when siblings allowed path cannot start '..' (reference to parent directory)
            if (allowSiblings && path.indexOf('..') === 0) {
                return FAILURE_BODY_SIBLINGS;
            }

            // '/../' and '/./' are always disallowed in the middle of module path
            if (illegalInsideRegex.test(path)) {
                return FAILURE_BODY_INSIDE;
            }
        }

        // explicitly return undefined when path is valid or not a literal
        return undefined;
    }

    function cb(node: ts.Node): void {
        if (tsutils.isExternalModuleReference(node)) {
            const errorBody = getValidationErrorBody(node.expression);
            if (errorBody !== undefined) {
                ctx.addFailureAt(node.getStart(), node.getWidth(), `External ${errorBody}: ${node.getText()}`);
            }
        } else if (tsutils.isImportDeclaration(node)) {
            const errorBody = getValidationErrorBody(node.moduleSpecifier);

            if (errorBody !== undefined) {
                const moduleSpecifier = (<ts.ImportDeclaration>node).moduleSpecifier;
                const imp = moduleSpecifier.getText().substr(1, moduleSpecifier.getText().length - 2);
                const absoluteModuleSpecifierPath = joinPath(dirname, imp);
                const remappedImport = `'${platformRemapFn(absoluteModuleSpecifierPath)}'`;
                const fix = new Lint.Replacement(moduleSpecifier.getStart(), moduleSpecifier.getWidth(), remappedImport);

                ctx.addFailureAt(node.getStart(), node.getWidth(), `Imported ${errorBody}: ${node.getText()}`, fix);
            }
        }

        return ts.forEachChild(node, cb);
    }

    return ts.forEachChild(ctx.sourceFile, cb);
}
