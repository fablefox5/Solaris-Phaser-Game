export default class EventManager {
    constructor(formator) {
        this.formator = formator;
    }

    CHANGE_FORMAT(index) {
        const oldFormat = this.formator.getFormat();
        this.formator.setFormat(index);
        return oldFormat;
    }
}