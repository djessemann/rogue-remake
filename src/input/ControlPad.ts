export type Direction = 'NW' | 'N' | 'NE' | 'W' | 'WAIT' | 'E' | 'SW' | 'S' | 'SE';
export type Action = 'inventory' | 'pickup' | 'wait' | 'stairs_up' | 'stairs_down' | 'help';

export interface ControlPadCallbacks {
  onDirection: (dir: Direction) => void;
  onAction: (action: Action) => void;
}

export class ControlPad {
  private dpadContainer: HTMLElement;
  private actionBarContainer: HTMLElement;
  private callbacks: ControlPadCallbacks;

  constructor(
    dpadContainer: HTMLElement,
    actionBarContainer: HTMLElement,
    callbacks: ControlPadCallbacks
  ) {
    this.dpadContainer = dpadContainer;
    this.actionBarContainer = actionBarContainer;
    this.callbacks = callbacks;
    this.createDPad();
    this.createActionBar();
  }

  private createDPad(): void {
    const directions: Direction[][] = [
      ['NW', 'N', 'NE'],
      ['W', 'WAIT', 'E'],
      ['SW', 'S', 'SE'],
    ];

    const arrows: Record<Direction, string> = {
      NW: '\u2196', // ↖
      N: '\u2191',  // ↑
      NE: '\u2197', // ↗
      W: '\u2190',  // ←
      WAIT: '\u00B7', // ·
      E: '\u2192',  // →
      SW: '\u2199', // ↙
      S: '\u2193',  // ↓
      SE: '\u2198', // ↘
    };

    this.dpadContainer.innerHTML = '';

    for (const row of directions) {
      for (const dir of row) {
        const btn = document.createElement('button');
        btn.className = 'dpad-btn' + (dir === 'WAIT' ? ' center' : '');
        btn.textContent = arrows[dir];
        btn.setAttribute('data-direction', dir);

        // Use touchstart for faster response on mobile
        btn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.callbacks.onDirection(dir);
        }, { passive: false });

        // Also support click for desktop
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.callbacks.onDirection(dir);
        });

        this.dpadContainer.appendChild(btn);
      }
    }
  }

  private createActionBar(): void {
    const actions: { label: string; action: Action }[] = [
      { label: 'I', action: 'inventory' },
      { label: 'P', action: 'pickup' },
      { label: 'W', action: 'wait' },
      { label: '<', action: 'stairs_up' },
      { label: '>', action: 'stairs_down' },
      { label: '?', action: 'help' },
    ];

    this.actionBarContainer.innerHTML = '';

    for (const { label, action } of actions) {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = label;
      btn.setAttribute('data-action', action);

      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.callbacks.onAction(action);
      }, { passive: false });

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.callbacks.onAction(action);
      });

      this.actionBarContainer.appendChild(btn);
    }
  }
}
