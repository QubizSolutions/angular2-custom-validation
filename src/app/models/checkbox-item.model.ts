export class CheckboxItem {
    id: number;
    checked: boolean;
    val: string;
    constructor(_id: number, _checked: boolean, _val: string){
        this.id = _id;
        this.checked = _checked;
        this.val = _val;
    }
}