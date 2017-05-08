export class RadioItem {
    id: number;
    value: string;
    checked: boolean;
    constructor(_id: number, _value: string, _checked: boolean){
        this.id = _id;
        this.value = _value;
        this.checked = _checked;
    }
}