import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileOnlyService {
  constructor() {
  }

  getMessages(): string[] {
    return ["[MobileOnlyService - TNS]"];
  }
}
