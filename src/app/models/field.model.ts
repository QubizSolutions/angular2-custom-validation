import { RadioItem } from './radio-item.model';

export class Field {
    label: string;
    value: string;
    customRuleFirst: Boolean;
    customRule: Function;
    required: Boolean;
    minLength: number;
    maxLength: number;
    disabled: boolean;
}