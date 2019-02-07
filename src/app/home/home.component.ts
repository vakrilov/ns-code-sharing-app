import { Component, OnInit } from '@angular/core';
import { SharedService } from '@src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = 'shared-project-test';

  message = "";

  constructor(public service: SharedService) { }

  ngOnInit() {
    this.message = this.service.getMessages().join("\n");
  }
}
