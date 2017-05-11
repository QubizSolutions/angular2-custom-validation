import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { CustomInput } from './components/custom-input/custom-input.component';
import { FieldInput } from './components/field-input/field-input.component';
import { CustomRadioGroup } from './components/radio/custom-radio-group.component';
import { CustomCheckboxGroup } from './components/checkbox/custom-checkbox-group.component';

import { CustomDropdown } from './components/dropdown/custom-dropdown.component';
import { PaginatedSearch } from './services/paginated-search.service';
import { ValidationMessages } from './services/validation-messages.service';
import { LocalStorageStatus } from './services/local-storage-status.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, ReactiveFormsModule,  NgbModule.forRoot(), InfiniteScrollModule],
  declarations: [
    AppComponent,
    CustomInput,
    CustomRadioGroup,
    CustomCheckboxGroup,
    FieldInput, 
    CustomDropdown
  ],
  providers: [PaginatedSearch, ValidationMessages, LocalStorageStatus],
  bootstrap: [AppComponent]
})
export class AppModule { }
