import { Injectable } from '@angular/core';
import { RadioItem } from '../models/radio-item.model';
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
    // if (radio !== null) {
    //   radio.forEach((item: RadioItem) => {
    //     if (lsValue && localStorage.getItem(label + '.' + item.value) == 'checked') {
    //       item.checked = true;
    //     }
    //     return item;
    //   })
    // }
  }

  setLocalStorageItem(lsValue, val, label) {
    if (lsValue && val !== ''){
      localStorage.setItem(label, val);
    }
  }

  removeLocalStorageItem(item) {
    localStorage.removeItem(item);
  }
}
