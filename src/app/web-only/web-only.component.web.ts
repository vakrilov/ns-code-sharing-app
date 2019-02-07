import { Component, OnInit } from '@angular/core';

// IMPORTANT: .web extension for CSS and HTML files is not automatically resolved
// We have to manually specify the extension in templateUrl and styleUrls
@Component({
  selector: 'app-web-only',
  templateUrl: './web-only.component.web.html',
  styleUrls: ['./web-only.component.web.css']
})
export class WebOnlyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
