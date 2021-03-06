import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ValidationMessages } from '../../services/validation-messages.service';
import { Field } from '../../models/field.model'
import { InputGroup } from '../../models/input-group.model';

@Component({
  selector: 'custom-input',
  template: `
      <div class="form-group" [ngClass]="{ 'has-danger': errorMessage && myPrivateValue != undefined, 'has-success': !errorMessage && myPrivateValue != undefined}">
        <label class="form-control-label" [ngClass]="{'required_field': required }">{{label}}</label>
        <input 
          type="text" 
          class="form-control form-control-danger form-control-success"
          [disabled]="disabled"
          [value]="customText" 
          (input)="customText = $event.target.value"/>
        <div *ngIf="errorMessage" class="form-control-feedback">{{errorMessage}}</div>
      </div>
      `,
  providers: [{ provide: InputGroup, useExisting: forwardRef(() => CustomInput) }]
})

export class CustomInput extends InputGroup {

  private errorMessage: string;
  private validationMessages: ValidationMessages;
  constructor(_validationMessages: ValidationMessages) {
    super();
    this.errorMessage = "";
    this.validationMessages = _validationMessages;
  }

  // Optional fields
  @Input() validationRule: Function;
  @Input() required: boolean;
  @Input() label: string;
  @Input() disabled: boolean = false;

  // customText property change event
  private myPrivateValue: string;
  @Output() customTextChange = new EventEmitter();

  // customText getter
  @Input()
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

    if (this.myPrivateValue != undefined && this.required) {
      this.validationMessages.IsRequired(val, errors);
    }
    
    if (this.validationRule != undefined) {
      errors = errors.concat(this.validationRule(val));
    }

    if (errors.length > 0) {
      this.errorMessage = errors.join(" | ");
    }
    else {
      this.customTextChange.emit(this.myPrivateValue);
      this.errorMessage = "";
    }
  }

  forceValidation = function () {
    if (this.myPrivateValue == undefined) {
      this.myPrivateValue = "";
    }
    this.customText = this.myPrivateValue;
    return this.errorMessage == "";
  }
}

