export class CanvasProcessor {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
  }

  drawImageWithText(image, text = 'LGTM', options = {}) {
    const {
      maxWidth = window.innerWidth * 0.9,
      maxHeight = window.innerHeight * 0.7
    } = options;

    const dimensions = this._calculateCanvasDimensions(
      image.width,
      image.height,
      maxWidth,
      maxHeight
    );

    this.canvas.width = dimensions.width;
    this.canvas.height = dimensions.height;

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.drawImage(
      image,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const fontSize = this.calculateFontSize(this.canvas.height);
    this.drawTextWithStroke(
      text,
      this.canvas.width / 2,
      this.canvas.height / 2,
      fontSize
    );
  }

  _calculateCanvasDimensions(imageWidth, imageHeight, maxWidth, maxHeight) {
    let width = imageWidth;
    let height = imageHeight;

    const aspectRatio = imageWidth / imageHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    return { width, height };
  }

  calculateFontSize(imageHeight) {
    const fontSize = imageHeight * 0.1;
    return Math.max(40, Math.min(200, fontSize));
  }

  drawTextWithStroke(text, x, y, fontSize) {
    this.ctx.font = `bold ${fontSize}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    const strokeWidth = fontSize * 0.05;

    this.ctx.strokeStyle = '#000000';
    this.ctx.lineWidth = strokeWidth;
    this.ctx.lineJoin = 'round';
    this.ctx.miterLimit = 2;
    this.ctx.strokeText(text, x, y);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(text, x, y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = 0;
    this.canvas.height = 0;
  }

  static isSupported() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  }
}
