import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plat-specific',
  templateUrl: './plat-specific.component.web.html',
  styleUrls: ['./plat-specific.component.web.css']
})
export class PlatSpecificComponent implements OnInit {

  sourceFile = "plat-specific.component.web.ts"

  constructor() { }

  ngOnInit() {
  }

}
