import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageStatus {
  localStorageStatus: boolean;
  lsField: string
  constructor() {}

  toggleStatus(status: boolean) {
    this.localStorageStatus = status
    localStorage.setItem('save', status.toString());
  }

  getLocalStorageItem(lsValue: boolean, label: string) {
    if (lsValue && localStorage.getItem(label)) {
      return localStorage.getItem(label);
    }
  }

  setLocalStorageItem(lsValue, val, label) {
    if (lsValue && val !== ''){
      localStorage.setItem(label, val);
    }
  }
}
