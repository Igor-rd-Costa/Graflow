import { Key } from "./Types/Enums";



const BITS_PER_KEY = 4
const KEYDOWN_VALUE = 1
const KEYUP_VALUE = 2
const KEYHOLD_VALUE = 4
const KEYS_PER_CHAR = 2
const ERASE_KEY_STATE_VALUE = ((KEYDOWN_VALUE | KEYUP_VALUE) | ((KEYDOWN_VALUE | KEYUP_VALUE) << 4))
const RESET_KEY_STATE_VALUE = ((KEYDOWN_VALUE | KEYHOLD_VALUE | KEYUP_VALUE) | ((KEYDOWN_VALUE | KEYHOLD_VALUE | KEYUP_VALUE) << 4))
export default class Input {
    private static input : Uint8Array;

    public static Init() {
        this.input = new Uint8Array(42);
    }

    public static RegisterKeyPress(input : string) {
        const key = this.InputToKey(input);
        if (key === -1)
            return;

        
        const index = this.GetIndex(key);
        const offset = this.GetOffset(key);
        this.input[index] |= (KEYDOWN_VALUE | KEYHOLD_VALUE) << (offset * BITS_PER_KEY);
    }
    
    public static RegisterKeyRelease(input : string) {
        const key = this.InputToKey(input);
        if (key === -1)
            return;

        const index = this.GetIndex(key);
		const offset = this.GetOffset(key);
		this.input[index] |= KEYUP_VALUE << (offset * BITS_PER_KEY);
		this.input[index] &= this.input[index] ^ (KEYDOWN_VALUE | KEYHOLD_VALUE) << (offset * BITS_PER_KEY);
    }

    public static KeyPressed(key : Key) : boolean
	{
		const index = this.GetIndex(key);
		const offset = this.GetOffset(key);
        const state = (this.input[index] & KEYDOWN_VALUE << (offset * BITS_PER_KEY));
		if ((this.input[index] & KEYDOWN_VALUE << (offset * BITS_PER_KEY)) === (KEYDOWN_VALUE << (offset * BITS_PER_KEY)))
			return true;
		else
			return false;
	}

	public static KeyReleased(key : Key) : boolean
	{
		const index = this.GetIndex(key);
		const offset = this.GetOffset(key);

		if ((this.input[index] & KEYUP_VALUE << (offset * BITS_PER_KEY)) === (KEYUP_VALUE << (offset * BITS_PER_KEY)))
			return true;
		else
			return false;
	}

	public static IsKeyDown(key : Key) : boolean
	{
		const index = this.GetIndex(key);
		const offset = this.GetOffset(key);

		if ((this.input[index] & KEYHOLD_VALUE << (offset * BITS_PER_KEY)) === (KEYHOLD_VALUE << (offset * BITS_PER_KEY)))
			return true;
		else
			return false;
	}

    public static UpdateState() {
        for (let i = 0; i < this.input.length; i++) {
            this.input[i] &= ~ERASE_KEY_STATE_VALUE;
        }
    }

    public static ResetState() {
        for (let i = 0; i < this.input.length; i++) {
            this.input[i] &= ~RESET_KEY_STATE_VALUE;
        }
    }

    private static GetIndex(key : Key) {
        return Math.floor(key / KEYS_PER_CHAR);
    }

    private static GetOffset(key : Key) {
        return Math.floor(key % KEYS_PER_CHAR);
    }

    private static InputToKey(keyCode : string) {
        switch(keyCode) {
            case 'Escape': return Key.KEY_ESC;
            case 'Tab': return Key.KEY_TAB;
            case 'CapsLock': return Key.KEY_CAPSLOCK;
            case 'ShiftLeft': return Key.KEY_LSHIFT;
            case 'ShiftRight': return Key.KEY_RSHIFT;
            case 'ControlLeft': return Key.KEY_LCTRL;
            case 'ControlRight': return Key.KEY_RCTRL;
            case 'AltLeft': return Key.KEY_LALT;
            case 'AltRight': return Key.KEY_RALT;
            case 'MetaLeft': return Key.KEY_META;
            case 'ContextMenu': return Key.KEY_CONTEXTMENU;
            case 'Space': return Key.KEY_SPACE;
            case 'Enter': return Key.KEY_ENTER;
            case 'Backspace': return Key.KEY_BACKSPACE;
            case 'Digit0': return Key.KEY_0;
            case 'Digit1': return Key.KEY_1;
            case 'Digit2': return Key.KEY_2;
            case 'Digit3': return Key.KEY_3;
            case 'Digit4': return Key.KEY_4;
            case 'Digit5': return Key.KEY_5;
            case 'Digit6': return Key.KEY_6;
            case 'Digit7': return Key.KEY_7;
            case 'Digit8': return Key.KEY_8;
            case 'Digit9': return Key.KEY_9;
            case 'KeyA': return Key.KEY_A;
            case 'KeyB': return Key.KEY_B;
            case 'KeyC': return Key.KEY_C;
            case 'KeyD': return Key.KEY_D;
            case 'KeyE': return Key.KEY_E;
            case 'KeyF': return Key.KEY_F;
            case 'KeyG': return Key.KEY_G;
            case 'KeyH': return Key.KEY_H;
            case 'KeyI': return Key.KEY_I;
            case 'KeyJ': return Key.KEY_J;
            case 'KeyK': return Key.KEY_K;
            case 'KeyL': return Key.KEY_L;
            case 'KeyM': return Key.KEY_M;
            case 'KeyN': return Key.KEY_N;
            case 'KeyO': return Key.KEY_O;
            case 'KeyP': return Key.KEY_P;
            case 'KeyQ': return Key.KEY_Q;
            case 'KeyR': return Key.KEY_R;
            case 'KeyS': return Key.KEY_S;
            case 'KeyT': return Key.KEY_T;
            case 'KeyU': return Key.KEY_U;
            case 'KeyV': return Key.KEY_V;
            case 'KeyW': return Key.KEY_W;
            case 'KeyX': return Key.KEY_X;
            case 'KeyY': return Key.KEY_Y;
            case 'KeyZ': return Key.KEY_Z;
            case 'Backquote': return Key.KEY_BACKQUOTE;
            case 'Minus': return Key.KEY_SUBTRACT;
            case 'Equal': return Key.KEY_EQUAL;
            case 'Comma': return Key.KEY_COMMA;
            case 'Period': return Key.KEY_POINT;
            case 'Numpad0': return Key.KEY_NUMPAD_0;
            case 'Numpad1': return Key.KEY_NUMPAD_1;
            case 'Numpad2': return Key.KEY_NUMPAD_2;
            case 'Numpad3': return Key.KEY_NUMPAD_3;
            case 'Numpad4': return Key.KEY_NUMPAD_4;
            case 'Numpad5': return Key.KEY_NUMPAD_5;
            case 'Numpad6': return Key.KEY_NUMPAD_6;
            case 'Numpad7': return Key.KEY_NUMPAD_7;
            case 'Numpad8': return Key.KEY_NUMPAD_8;
            case 'Numpad9': return Key.KEY_NUMPAD_9;
            case 'NumpadDecimal': return Key.KEY_NUMPAD_COMMA;
            case 'NumpadEnter': return Key.KEY_NUMPAD_ENTER;
            case 'NumpadAdd': return Key.KEY_NUMPAD_ADD;
            case 'NumpadSubtract': return Key.KEY_NUMPAD_SUBTRACT;
            case 'NumpadMultiply': return Key.KEY_NUMPAD_MULTIPLY;
            case 'NumpadDivide': return Key.KEY_NUMPAD_DIVIDE;
            case 'NumLock': return Key.KEY_NUMLOCK;
            case 'LMouse': return Key.KEY_MOUSE_LBUTTON;
            case 'MMouse': return Key.KEY_MOUSE_MBUTTON;
            case 'RMouse': return Key.KEY_MOUSE_RBUTTON;
            //Using BR keyboard layout keyCodes don't match the key. not sure if it would be a problem when using
            //with other layouts but prob won't use this keys so won't be a problem.
            case 'Slash': return Key.KEY_SEMICOLON;
            case 'IntlBackslash': return Key.KEY_BSLASH;
            case 'IntlRo': return Key.KEY_FSLASH;
            case 'BracketRight': return Key.KEY_LBRACKET;
            case 'Backslash': return Key.KEY_RBRAKET;
            case 'ArrowUp': return Key.KEY_ARROW_UP;
            case 'ArrowDown': return Key.KEY_ARROW_DOWN;
            case 'ArrowLeft': return Key.KEY_ARROW_LEFT;
            case 'ArrowRight': return Key.KEY_ARROW_RIGHT;
            default: {
                console.warn("Not implemented code for %s.", keyCode);
                return -1;
            }
        }
    }
}