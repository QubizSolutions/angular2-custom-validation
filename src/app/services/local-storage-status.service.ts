import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageStatus {
  localStorageStatus: boolean;
  constructor() {}

  toggleStatus(status: boolean) {
    this.localStorageStatus = status
  }
}
