import * as ROT from 'rot-js';

// Viewport size - smaller viewport = larger characters
// 20x12 gives a nice zoomed-in feel on mobile
const VIEWPORT_COLS = 20;
const VIEWPORT_ROWS = 12;

export class Display {
  private rotDisplay: ROT.Display;
  private container: HTMLElement;

  // Camera position (top-left of viewport in world coords)
  private cameraX: number = 0;
  private cameraY: number = 0;

  // Track logical font size for CSS scaling
  private logicalFontSize: number = 16;

  constructor(container: HTMLElement) {
    this.container = container;
    this.logicalFontSize = this.calculateFontSize();

    // Render at higher resolution for crisp text on high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const renderFontSize = Math.round(this.logicalFontSize * dpr);

    // Classic terminal-style font for authentic retro feel
    const fontStack = 'Menlo, Consolas, "DejaVu Sans Mono", monospace';

    this.rotDisplay = new ROT.Display({
      width: VIEWPORT_COLS,
      height: VIEWPORT_ROWS,
      fontSize: renderFontSize,
      fontFamily: fontStack,
      fontStyle: 'normal',
      forceSquareRatio: true,
      bg: '#1a3020',
    });

    const canvas = this.rotDisplay.getContainer() as HTMLCanvasElement;
    if (canvas) {
      // Scale canvas back down with CSS for crisp rendering
      this.applyCanvasScaling(canvas, dpr);
      // Disable image smoothing for sharper text
      this.disableSmoothing(canvas);
      container.appendChild(canvas);
    }

    window.addEventListener('resize', () => this.handleResize());
  }

  private applyCanvasScaling(canvas: HTMLCanvasElement, dpr: number): void {
    // Get the actual canvas dimensions and scale down for display
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  private disableSmoothing(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
  }

  private calculateFontSize(): number {
    const displayEl = this.container;
    const availableWidth = displayEl.clientWidth || window.innerWidth;
    const availableHeight = displayEl.clientHeight || window.innerHeight * 0.4;

    // Calculate optimal font size to fill available space
    const fontByWidth = Math.floor(availableWidth / VIEWPORT_COLS);
    const fontByHeight = Math.floor(availableHeight / VIEWPORT_ROWS);

    // Clamp between reasonable min/max values
    return Math.max(16, Math.min(fontByWidth, fontByHeight, 40));
  }

  private handleResize(): void {
    this.logicalFontSize = this.calculateFontSize();
    const dpr = window.devicePixelRatio || 1;
    const renderFontSize = Math.round(this.logicalFontSize * dpr);

    this.rotDisplay.setOptions({ fontSize: renderFontSize });

    const canvas = this.rotDisplay.getContainer() as HTMLCanvasElement;
    if (canvas) {
      this.applyCanvasScaling(canvas, dpr);
      this.disableSmoothing(canvas);
    }
  }

  // Center the camera on a position (usually the player)
  centerOn(worldX: number, worldY: number, mapWidth: number, mapHeight: number): void {
    // Calculate camera position to center on target
    this.cameraX = worldX - Math.floor(VIEWPORT_COLS / 2);
    this.cameraY = worldY - Math.floor(VIEWPORT_ROWS / 2);

    // Clamp to map bounds
    this.cameraX = Math.max(0, Math.min(this.cameraX, mapWidth - VIEWPORT_COLS));
    this.cameraY = Math.max(0, Math.min(this.cameraY, mapHeight - VIEWPORT_ROWS));
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX: number, worldY: number): { x: number; y: number } | null {
    const screenX = worldX - this.cameraX;
    const screenY = worldY - this.cameraY;

    // Check if in viewport
    if (screenX < 0 || screenX >= VIEWPORT_COLS || screenY < 0 || screenY >= VIEWPORT_ROWS) {
      return null;
    }

    return { x: screenX, y: screenY };
  }

  // Draw at world coordinates (automatically converted to screen)
  drawWorld(worldX: number, worldY: number, char: string, fg: string = '#fff', bg: string = '#000'): void {
    const screen = this.worldToScreen(worldX, worldY);
    if (screen) {
      this.rotDisplay.draw(screen.x, screen.y, char, fg, bg);
    }
  }

  // Draw directly at screen coordinates
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

  getViewportSize(): { cols: number; rows: number } {
    return { cols: VIEWPORT_COLS, rows: VIEWPORT_ROWS };
  }

  getCameraPosition(): { x: number; y: number } {
    return { x: this.cameraX, y: this.cameraY };
  }
}
