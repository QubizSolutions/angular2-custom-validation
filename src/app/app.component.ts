import { AfterViewInit, Component, ContentChildren, ViewChildren, QueryList, forwardRef } from '@angular/core';
import { ValidationMessages } from './services/validation-messages.service'
import { Field } from './models/field.model'
import { InputGroup } from './models/input-group.model'
import { FieldInput } from './components/field-input/field-input.component'
import { CustomInput } from './components/custom-input/custom-input.component'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html',
    styles: [`
    .dropdown-content {
      max-height: 200px;
      overflow: auto;
    }
  `],
})
export class AppComponent {
    @ViewChildren(forwardRef(() => InputGroup)) allInputItems: QueryList<InputGroup>;

    ngAfterViewInit() {
        console.info(this.allInputItems);
    }

    customForm = {
        firstName: new Field,
        lastName: new Field,
        occupation: new Field,
        nickName: new Field,
        gender: Boolean,
        //...
        favoritSerial: new Field
    };

    valid: boolean = false;
    submitMessage: string = '';
    lengthValidationEnabled: boolean;
    validationRule: Function;
    
    private validationMessages: ValidationMessages;
    constructor(_validationMessages: ValidationMessages) {
        this.validationMessages = _validationMessages;
        var _this = this;
        this.customForm.firstName.label = "First name"
        this.customForm.firstName.required = true;
        this.customForm.firstName.customRule = function (value: string) {
            var errors = new Array<string>();
            if (value != undefined) {
                if (_this.lengthValidationEnabled) {
                    _this.validationMessages.MaxLength(8, value, errors);
                }

                _this.validationMessages.MinLength(3, value, errors);
            }
            return errors;
        }
        this.customForm.lastName.label = "Last name";
        this.customForm.occupation.label = "Occupation";

        this.customForm.nickName.label = "Nick name";
        this.customForm.nickName.required = true;
        this.customForm.nickName.customRule = function (value: string) {
            var errors = new Array<string>();
            if (_this.customForm.firstName.value != undefined && !_this.customForm.firstName.value.startsWith(value)) {
                errors.push("Fake nickname");
            }
            return errors;
        };

        this.customForm.favoritSerial.label = "Series";
        this.lengthValidationEnabled = true;

        this.customForm.favoritSerial.disabled = true;
        this.customForm.nickName.disabled = true;
    }

    submit = function () {
        var allValid = true;
        this.allInputItems.forEach(inputInstance => allValid = inputInstance.forceValidation() && allValid)
        this.valid = allValid;
        if (this.valid) {
            this.submitMessage = 'Valid'
        } else {
            this.submitMessage = 'Not Valid'
        }
    }

    status() {
        this.customForm.nickName.disabled = !this.customForm.nickName.disabled
        this.customForm.favoritSerial.disabled = !this.customForm.favoritSerial.disabled
    }
}
