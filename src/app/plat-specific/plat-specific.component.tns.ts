import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plat-specific',
  templateUrl: './plat-specific.component.html',
  styleUrls: ['./plat-specific.component.css']
})
export class PlatSpecificComponent implements OnInit {
  sourceFile = "plat-specific.component.tns.ts"

  constructor() { }

  ngOnInit() {
  }

}
