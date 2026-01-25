import * as ROT from 'rot-js';
import { COLS, ROWS } from '../constants';

export class Display {
  private rotDisplay: ROT.Display;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    const fontSize = this.calculateFontSize();

    this.rotDisplay = new ROT.Display({
      width: COLS,
      height: ROWS,
      fontSize,
      fontFamily: 'monospace',
      forceSquareRatio: true,
      bg: '#000',
    });

    const canvas = this.rotDisplay.getContainer();
    if (canvas) {
      container.appendChild(canvas);
    }

    window.addEventListener('resize', () => this.handleResize());
  }

  private calculateFontSize(): number {
    const displayEl = this.container;
    const availableWidth = displayEl.clientWidth || window.innerWidth;
    const availableHeight = displayEl.clientHeight || window.innerHeight * 0.5;

    const fontByWidth = Math.floor(availableWidth / COLS);
    const fontByHeight = Math.floor(availableHeight / ROWS);

    return Math.max(8, Math.min(fontByWidth, fontByHeight));
  }

  private handleResize(): void {
    const fontSize = this.calculateFontSize();
    this.rotDisplay.setOptions({ fontSize });
  }

  draw(x: number, y: number, char: string, fg: string = '#fff', bg: string = '#000'): void {
    this.rotDisplay.draw(x, y, char, fg, bg);
  }

  drawText(x: number, y: number, text: string, maxWidth?: number): void {
    this.rotDisplay.drawText(x, y, text, maxWidth);
  }

  clear(): void {
    this.rotDisplay.clear();
  }

  getContainer(): HTMLElement | null {
    return this.rotDisplay.getContainer();
  }
}
