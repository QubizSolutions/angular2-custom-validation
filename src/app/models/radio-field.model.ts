import { Field } from './field.model';
import { RadioItem } from './radio-item.model';

export class RadioField extends Field {
    items: Array<RadioItem>
}