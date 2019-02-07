import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebOnlyService {
  constructor() {
  }

  getMessages(): string[] {
    return ["[WebOnlyService - WEB]"];
  }
}
