import { FileHandler } from './file-handler.js';
import { CanvasProcessor } from './canvas.js';

class LGTMApp {
  constructor() {
    this.elements = {
      uploadSection: document.getElementById('upload-section'),
      previewSection: document.getElementById('preview-section'),
      dropZone: document.getElementById('drop-zone'),
      fileInput: document.getElementById('file-input'),
      canvas: document.getElementById('preview-canvas'),
      downloadBtn: document.getElementById('download-btn'),
      resetBtn: document.getElementById('reset-btn'),
      errorMessage: document.getElementById('error-message'),
      loading: document.getElementById('loading')
    };

    this.fileHandler = new FileHandler({
      maxFileSize: 10 * 1024 * 1024,
      acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    });
    this.canvasProcessor = new CanvasProcessor(this.elements.canvas);

    this.currentImage = null;
    this.currentFilename = '';

    this.checkBrowserSupport();
    this.initializeEventListeners();
  }

  checkBrowserSupport() {
    if (!CanvasProcessor.isSupported()) {
      this.showError("Your browser doesn't support Canvas API. Please use a modern browser.");
    }
  }

  initializeEventListeners() {
    this.elements.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    });

    this.elements.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.elements.dropZone.classList.add('drag-over');
    });

    this.elements.dropZone.addEventListener('dragleave', () => {
      this.elements.dropZone.classList.remove('drag-over');
    });

    this.elements.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.elements.dropZone.classList.remove('drag-over');

      const file = e.dataTransfer.files[0];
      if (file) {
        this.handleFileUpload(file);
      }
    });

    this.elements.downloadBtn.addEventListener('click', () => {
      this.handleDownload();
    });

    this.elements.resetBtn.addEventListener('click', () => {
      this.resetApp();
    });

    this.elements.dropZone.addEventListener('click', () => {
      this.elements.fileInput.click();
    });
  }

  async handleFileUpload(file) {
    this.hideError();

    const validation = this.fileHandler.validateFile(file);
    if (!validation.valid) {
      this.showError(validation.error);
      return;
    }

    this.showLoading();

    try {
      const image = await this.fileHandler.loadImageFromFile(file);

      this.currentImage = image;
      this.currentFilename = file.name;

      this.canvasProcessor.drawImageWithText(image, 'LGTM');

      this.showPreview();

    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoading();
    }
  }

  handleDownload() {
    if (!this.currentImage) {
      this.showError('No image to download');
      return;
    }

    const filename = this.fileHandler.generateLGTMFilename(this.currentFilename);

    this.fileHandler.downloadCanvas(this.elements.canvas, filename);
  }

  resetApp() {
    this.canvasProcessor.clear();

    this.currentImage = null;
    this.currentFilename = '';

    this.elements.fileInput.value = '';

    this.hidePreview();
    this.hideError();
  }

  showPreview() {
    this.elements.uploadSection.classList.add('hidden');
    this.elements.previewSection.classList.remove('hidden');
  }

  hidePreview() {
    this.elements.uploadSection.classList.remove('hidden');
    this.elements.previewSection.classList.add('hidden');
  }

  showLoading() {
    this.elements.loading.classList.remove('hidden');
  }

  hideLoading() {
    this.elements.loading.classList.add('hidden');
  }

  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorMessage.classList.remove('hidden');

    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  hideError() {
    this.elements.errorMessage.textContent = '';
    this.elements.errorMessage.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new LGTMApp();
});
