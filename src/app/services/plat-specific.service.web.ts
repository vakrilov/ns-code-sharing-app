import { Injectable } from '@angular/core';
import { WebOnlyService } from '@src/app/services/web-only.service';

@Injectable({
  providedIn: 'root'
})
export class PlatSpecificService {
  constructor(private webSrv: WebOnlyService) {
  }

  getMessages(): string[] {
    return [
      "[PlatSpecificService - WEB]",
      ...this.webSrv.getMessages()
    ];
  }
}
