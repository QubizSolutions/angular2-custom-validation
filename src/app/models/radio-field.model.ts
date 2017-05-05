import { Field } from './field.model';
import { RadioItem } from './radio-item.model';

export class RadioField extends Field {
    title: string;
    items: Array<RadioItem>;
    radioButtonIdentifier: string;
    changeDesign: Function;
}