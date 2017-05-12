import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'
import { InputGroup } from '../../models/input-group.model'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageStatus } from '../../services/local-storage-status.service';

@Component({
  selector: 'field-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage && myPrivateValue !== undefined, 'has-success': !errorMessage && myPrivateValue !== undefined && myPrivateValue !== emptyString && !validationObject.disabled}">
        <label class="form-control-label" [ngClass]="{'required_field': validationObject.required}" *ngIf="validationObject.label" for="nickname" >{{validationObject.label}}</label>
        <input 
          type="text" 
          class="form-control form-control-danger form-control-success"
          [disabled]="validationObject.disabled" 
          [value]="myPrivateValue" 
          (input)="inputChange($event.target.value)"
          (blur)="storeValue($event)">
        <div class="form-control-feedback" [ngClass]="{ 'error_msg': errorMessage}">{{errorMessage}}</div>
      </div>
      `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => FieldInput) }]
})

export class FieldInput extends InputGroup implements OnInit {

  private errorMessage: string;

  constructor(private validationMessages: ValidationMessages, private lStorage: LocalStorageStatus) {
    super();
    this.errorMessage = "";
  }

  
  private emptyString: string = "";
  private myPrivateValue: string;

  @Input() validationObject: Field;

  // customText setter
  inputChange(val: string) {
    this.myPrivateValue = val;
    var errors = new Array<string>();
    if (this.validationObject.required && !this.validationObject.disabled) {
      this.validationMessages.IsRequired(val, errors);
    }

    if (this.validationObject.customRule != undefined && !this.validationObject.disabled) {
      errors = errors.concat(this.validationObject.customRule(val));
    }

    if (errors.length > 0) {
      this.errorMessage = errors.join(" | ");
    }
    else {
      this.validationObject.value = this.myPrivateValue;
      this.errorMessage = "";
    }
  }

  ngOnInit() {
    if (this.validationObject.saveStorage == undefined) {
      this.myPrivateValue = this.lStorage.getLocalStorageItem(this.lStorage.localStorageStatus, this.validationObject.label);
    } else {
      this.myPrivateValue = this.lStorage.getLocalStorageItem(this.validationObject.saveStorage, this.validationObject.label);
    }
    if (this.myPrivateValue == undefined) this.myPrivateValue = "";
  }

  // Methods

  storeValue(event) {
    let val = event.target.value.trim();
    if (this.validationObject.saveStorage == undefined) {
      this.lStorage.setLocalStorageItem(this.lStorage.localStorageStatus, val, this.validationObject.label);
    } else {
      this.lStorage.setLocalStorageItem(this.validationObject.saveStorage, val, this.validationObject.label);
    }
  }

  forceValidation = function () {
    if (this.myPrivateValue == undefined && !this.validationObject.disabled) {
      this.myPrivateValue = "";
    }
    this.inputChange(this.myPrivateValue);
    return this.errorMessage == "";
  }
}