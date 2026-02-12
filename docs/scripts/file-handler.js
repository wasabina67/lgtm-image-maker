export class FileHandler {
  constructor(config = {}) {
    this.maxFileSize = config.maxFileSize || 10 * 1024 * 1024;
    this.acceptedFormats = config.acceptedFormats || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];
  }

  validateFile(file) {
    if (!file) {
      return {
        valid: false,
        error: 'No file selected'
      };
    }

    if (!this.acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: 'Unsupported file format. Supported: JPEG, PNG, GIF, WebP'
      };
    }

    if (file.size > this.maxFileSize) {
      const maxSizeMB = Math.round(this.maxFileSize / 1024 / 1024);
      return {
        valid: false,
        error: `File size too large. Maximum ${maxSizeMB}MB`
      };
    }

    return { valid: true, error: null };
  }

  loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          resolve(img);
        };

        img.onerror = () => {
          reject(new Error('Failed to load image. Please try another file'));
        };

        img.src = e.target.result;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  downloadCanvas(canvas, filename) {
    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        this._downloadBlob(blob, filename);
      }, 'image/png');
    } else {
      const dataURL = canvas.toDataURL('image/png');
      this._downloadDataURL(dataURL, filename);
    }
  }

  _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  _downloadDataURL(dataURL, filename) {
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  }

  removeExtension(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return filename;
    }
    return filename.substring(0, lastDotIndex);
  }

  generateLGTMFilename(originalFilename) {
    const baseName = this.removeExtension(originalFilename);
    return `lgtm-${baseName}.png`;
  }
}
