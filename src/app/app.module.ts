import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { AppComponent } from './app.component';
import { CustomInput } from './components/custom-input/custom-input.component';
import { FieldInput } from './components/field-input/field-input.component';

import { CustomDropdown } from './components/dropdown/custom-dropdown.component'
import { MyService } from './services/sample.service';
import { ValidationMessages } from './services/validation-messages.service'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

@NgModule({
  imports: [BrowserModule, HttpModule, FormsModule, NgbModule.forRoot(), InfiniteScrollModule],
  declarations: [
    AppComponent,
    CustomInput,
    FieldInput, 
    CustomDropdown
  ],
  providers: [MyService, ValidationMessages],
  bootstrap: [AppComponent]
})
export class AppModule { }
