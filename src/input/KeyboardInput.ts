import type { Direction, Action } from './ControlPad';

export interface KeyboardCallbacks {
  onDirection: (dir: Direction) => void;
  onAction: (action: Action) => void;
}

export class KeyboardInput {
  private callbacks: KeyboardCallbacks;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  private keyMap: Record<string, Direction> = {
    // Arrow keys
    ArrowUp: 'N',
    ArrowDown: 'S',
    ArrowLeft: 'W',
    ArrowRight: 'E',
    // Numpad
    Numpad7: 'NW',
    Numpad8: 'N',
    Numpad9: 'NE',
    Numpad4: 'W',
    Numpad5: 'WAIT',
    Numpad6: 'E',
    Numpad1: 'SW',
    Numpad2: 'S',
    Numpad3: 'SE',
    // Vi keys
    y: 'NW',
    k: 'N',
    u: 'NE',
    h: 'W',
    l: 'E',
    b: 'SW',
    j: 'S',
    n: 'SE',
    // WASD (4-directional)
    w: 'N',
    a: 'W',
    s: 'S',
    d: 'E',
  };

  private actionMap: Record<string, Action> = {
    i: 'inventory',
    ',': 'pickup',
    g: 'pickup', // Alternative
    '.': 'wait',
    ' ': 'wait',
    '<': 'stairs_up',
    '>': 'stairs_down',
    '?': 'help',
  };

  constructor(callbacks: KeyboardCallbacks) {
    this.callbacks = callbacks;
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.boundHandleKeyDown);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    // Don't capture if typing in an input field
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = e.key;

    // Check for direction
    if (this.keyMap[key]) {
      e.preventDefault();
      this.callbacks.onDirection(this.keyMap[key]);
      return;
    }

    // Check for action
    if (this.actionMap[key]) {
      e.preventDefault();
      this.callbacks.onAction(this.actionMap[key]);
      return;
    }
  }

  destroy(): void {
    window.removeEventListener('keydown', this.boundHandleKeyDown);
  }
}
