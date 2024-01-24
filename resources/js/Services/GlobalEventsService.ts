

export type ClickEventCallback = (event : MouseEvent) => void;

export default class GlobalEventsService
{
    private static clickEventListeners : ClickEventCallback[] = [];

    public static Init() {
        document.addEventListener('click', this.OnClick.bind(this));
    }

    public static RegisterClickCallback(callback : ClickEventCallback) {
        this.clickEventListeners.push(callback);
    }

    private static OnClick(event : MouseEvent) {
        this.clickEventListeners.forEach(callback => callback(event));
    }
}