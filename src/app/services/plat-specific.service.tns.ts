import { Injectable } from '@angular/core';
import { MobileOnlyService } from '@src/app/services/mobile-only.service.tns';

@Injectable({
  providedIn: 'root'
})
export class PlatSpecificService {
  constructor(private mobileSrv: MobileOnlyService) {
  }

  getMessages(): string[] {
    return [
      "[PlatSpecificService - TNS]",
      ...this.mobileSrv.getMessages()];
  }
}
