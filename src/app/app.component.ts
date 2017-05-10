import { AfterViewInit, Component, ContentChildren, ViewChildren, QueryList, forwardRef, Input, EventEmitter, Output } from '@angular/core';
import { ValidationMessages } from './services/validation-messages.service';
import { Field } from './models/field.model';
import { InputGroup } from './models/input-group.model';
import { FieldInput } from './components/field-input/field-input.component';
import { CustomInput } from './components/custom-input/custom-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RadioItem } from './models/radio-item.model';
import { RadioField } from './models/radio-field.model';
import { CheckboxItem } from './models/checkbox-item.model';
import { CheckboxField } from './models/checkbox-field.model';
import { DropdownField } from './models/dropdown-field.model';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageStatus } from './services/local-storage-status.service';
@Component({
    selector: 'my-app',
    templateUrl: './app/app.component.html'
})
export class AppComponent {
    @ViewChildren(forwardRef(() => InputGroup)) allInputItems: QueryList<InputGroup>;
    customForm = {
        firstName: new Field,
        lastName: new Field,
        occupation: new Field,
        nickName: new Field,
        gender: new RadioField,
        accept: new RadioField,
        changeLayout: new RadioField,
        favoriteFood: new CheckboxField,

        //...
        dropdownItems: {
            series: new DropdownField,
            movies: new DropdownField
        }
    };

    valid: boolean = false;
    submitMessage: string = '';
    lengthValidationEnabled: boolean;
    validationRule: Function;
    saveToLocalStorageEnabled: boolean;

    private validationMessages: ValidationMessages;
    constructor(_validationMessages: ValidationMessages, private lStorage: LocalStorageStatus) {

        this.validationMessages = _validationMessages;
        var _this = this;

        // Validation Options

        this.lengthValidationEnabled = true;     // Field min/max value length
        this.saveToLocalStorageEnabled = false;  // Save to LocalStorage

        if (localStorage.getItem('save') == 'true') {
            this.saveToLocalStorageEnabled = true;
        } else if (localStorage.getItem('save') == 'false'){
            this.saveToLocalStorageEnabled = false;
        }
        
        this.lStorage.toggleStatus(this.saveToLocalStorageEnabled);

        // Field Input Options

        // First name
        this.customForm.firstName.label = "First name"
        this.customForm.firstName.required = true;
        this.customForm.firstName.saveStorage = false;
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

        // Last name
        this.customForm.lastName.label = "Last name";
        this.customForm.lastName.required = true;
        this.customForm.lastName.saveStorage = true;

        // Occupation
        this.customForm.occupation.label = "Occupation";
        this.customForm.occupation.required = true;

        // Nick name
        this.customForm.nickName.label = "Nick name";
        this.customForm.nickName.required = true;
        this.customForm.nickName.disabled = true;
        this.customForm.nickName.customRule = function (value: string) {
            var errors = new Array<string>();
            if (_this.customForm.firstName.value !== undefined && !_this.customForm.firstName.value.startsWith(value)) {
                errors.push("Fake nickname");
            }
            return errors;
        };

        // Radio Components Options

        // Gender
        this.customForm.gender.title = "Please select gender:";
        this.customForm.gender.radioButtonIdentifier = 'gender';
        this.customForm.gender.disabled = true;
        this.customForm.gender.required = true;
        this.customForm.gender.items = [
            new RadioItem(1, "Male", false), 
            new RadioItem(2, "Female", false)
        ]

        // Accept
        this.customForm.accept.title = "Do you accept the terms?";
        this.customForm.accept.radioButtonIdentifier = 'accept';
        this.customForm.accept.disabled = false;
        this.customForm.accept.required = true;
        this.customForm.accept.items = [
            new RadioItem(1, "Yes", false), 
            new RadioItem(2, "No", false), 
            new RadioItem(3, "Maybe", false)
        ]

        // changeLayout
        this.customForm.changeLayout.title = "Execute a function:";
        this.customForm.changeLayout.radioButtonIdentifier = 'changeLayout';
        this.customForm.changeLayout.disabled = false;
        this.customForm.changeLayout.required = true;
        this.customForm.changeLayout.items = [
            new RadioItem(1, "Do something", false),
            new RadioItem(2, "Do something else", false)
        ];
        this.customForm.changeLayout.changeDesign = function (value) {
            console.log(value);
        }

        // Checkbox Components Options
        this.customForm.favoriteFood.title = "Pick your favorite food: ";
        this.customForm.favoriteFood.disabled = false;
        this.customForm.favoriteFood.required = true;
        this.customForm.favoriteFood.items = [
            new CheckboxItem(1, false, "Pizza"),
            new CheckboxItem(2, false, "Hamburger"),
            new CheckboxItem(3, false, "Pasta")
        ]
        
        // Dropdown Components Options

        // Series
        this.customForm.dropdownItems.series.label = "Series";
        this.customForm.dropdownItems.series.dropdownItem = "series";
        this.customForm.dropdownItems.series.required = true;

        // Movies
        this.customForm.dropdownItems.movies.label = "Movies";
        this.customForm.dropdownItems.movies.dropdownItem = "movies";
        this.customForm.dropdownItems.movies.required = true;        
    }


    // Methods
    
    submit = function () {
        var allValid = true;
        this.allInputItems.forEach(inputInstance => allValid = inputInstance.forceValidation() && allValid)
        this.valid = allValid;
        if (this.valid) {
            this.submitMessage = 'Valid'
            localStorage.clear();
            localStorage.setItem('save', this.saveToLocalStorageEnabled.toString());

        } else {
            this.submitMessage = 'Not Valid'
        }
    }

    // Enable/Disable specific fields
    status() {
        this.customForm.nickName.disabled = !this.customForm.nickName.disabled;
    }

    // Enable/Disable setting values in localstorage
    toggleSaveStorage() {
        this.saveToLocalStorageEnabled = !this.saveToLocalStorageEnabled
        this.lStorage.toggleStatus(this.saveToLocalStorageEnabled);
    } 
}
