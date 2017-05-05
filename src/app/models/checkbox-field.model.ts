import { Field } from './field.model';
import { CheckboxItem } from './checkbox-item.model';

export class CheckboxField extends Field {
    title: string;
    items: Array<CheckboxItem>;
    changeDesign: Function;
}