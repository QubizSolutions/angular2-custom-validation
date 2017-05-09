import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service'
import { Field } from '../../models/field.model'
import { InputGroup } from '../../models/input-group.model'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'field-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage && myPrivateValue !== undefined, 'has-success': !errorMessage && myPrivateValue !== undefined && myPrivateValue !== emptyString && !validationObject.disabled}">
        <label class="form-control-label" [ngClass]="{'required_field': validationObject.required}" *ngIf="validationObject.label" for="nickname" >{{validationObject.label}}</label>
        <input 
          type="text" 
          class="form-control form-control-danger form-control-success"
          [disabled]="validationObject.disabled" 
          [value]="customText" 
          (input)="customText = $event.target.value"
          (blur)="storeValue($event)">
        <div class="form-control-feedback" [ngClass]="{ 'error_msg': errorMessage}">{{errorMessage}}</div>
      </div>
      `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => FieldInput) }]
})

export class FieldInput extends InputGroup implements OnInit {

  private errorMessage: string;
  private validationMessages: ValidationMessages;

  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  
  private emptyString: string = "";
  private myPrivateValue: string;

  @Input() validationObject: Field;

  // customText getter
  get customText() {
    if (this.myPrivateValue == undefined) {
      return "";
    }
    return this.myPrivateValue;
  }

  // customText setter
  set customText(val: string) {
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
    if (localStorage.getItem(this.validationObject.label)) {
      let inputValue = localStorage.getItem(this.validationObject.label);
      this.myPrivateValue = inputValue;
    }
  }

  // Methods

  storeValue(event) {
    let elem = event.target;
    let val = event.target.value.trim();
    if (val !== '' && !this.errorMessage){
      localStorage.setItem(this.validationObject.label, val);
    }
  }

  forceValidation = function () {
    if (this.myPrivateValue == undefined && !this.validationObject.disabled) {
      this.myPrivateValue = "";
    }
    this.customText = this.myPrivateValue;
    return this.errorMessage == "";
  }
}

