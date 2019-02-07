import { Injectable } from '@angular/core';
import { PlatSpecificService } from '@src/app/services/plat-specific.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private platSrv: PlatSpecificService) {
  }

  getMessages(): string[] {
    return [
      "[SharedService]",
      ...this.platSrv.getMessages()
    ];
  }
}
