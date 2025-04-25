import Quagga from 'quagga';

class BarcodeService {
  constructor() {
    this.isInitialized = false;
    this.currentStream = null;
  }

  /**
   * Initializes Quagga for barcode scanning
   * @param {HTMLElement} targetElement - The DOM element to render the scanner
   * @returns {Promise<void>}
   */
  async initialize(targetElement) {
    if (this.isInitialized) {
      return;
    }

    // Check if the browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Browser does not support camera access');
    }

    // Check if the target element exists
    if (!targetElement) {
      throw new Error('Target element for scanner not found');
    }

    return new Promise((resolve, reject) => {
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: targetElement,
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 2 },
            facingMode: "environment",
            frameRate: { ideal: 30, min: 15 }
          },
        },
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader",
            "code_128_reader"
          ],
          debug: {
            drawBoundingBox: true,
            showPattern: true
          }
        },
        locate: true,
        frequency: 10
      }, (err) => {
        if (err) {
          console.error("Quagga initialization error:", err);
          reject(new Error(`Failed to initialize camera: ${err.message || 'Unknown error'}`));
          return;
        }

        // Store the video stream
        const videoTrack = Quagga.CameraAccess.getActiveTrack();
        if (videoTrack) {
          this.currentStream = new MediaStream([videoTrack]);
        }

        this.isInitialized = true;
        console.log("Quagga initialization successful");
        resolve();
      });
    });
  }

  /**
   * Starts the barcode scanner
   * @param {Function} onDetected - Callback function when a barcode is detected
   */
  start(onDetected) {
    if (!this.isInitialized) {
      throw new Error("Scanner not initialized. Call initialize() first.");
    }

    Quagga.onDetected((result) => {
      if (result && result.codeResult && result.codeResult.code) {
        const code = result.codeResult.code;
        console.log("Barcode detected:", code);
        onDetected(code);
      }
    });

    Quagga.start();
  }

  /**
   * Stops the barcode scanner
   */
  stop() {
    try {
      if (this.currentStream) {
        this.currentStream.getTracks().forEach(track => track.stop());
        this.currentStream = null;
      }

      if (this.isInitialized) {
        Quagga.offDetected();
        Quagga.stop();
        this.isInitialized = false;
        console.log("Scanner stopped successfully");
      }
    } catch (error) {
      console.error("Error stopping scanner:", error);
      // Reset state even if there's an error
      this.isInitialized = false;
      this.currentStream = null;
    }
  }

  /**
   * Processes a barcode and returns structured data
   * @param {string} barcode - The scanned barcode
   * @returns {Object} - Structured data from the barcode
   */
  processBarcode(barcode) {
    if (!barcode || typeof barcode !== 'string') {
      return {
        status: 'error',
        message: 'Invalid barcode input'
      };
    }

    let ndcCode = null;
    
    // Check if the barcode is in NDC format
    if (barcode.match(/^\d{4}-\d{4}-\d{2}$|^\d{5}-\d{3}-\d{2}$|^\d{5}-\d{4}-\d{1}$/)) {
      ndcCode = barcode;
    }
    // For other formats, try to extract NDC portion
    else if (barcode.length >= 10) {
      const potentialNdc = barcode.replace(/[^0-9]/g, '');
      if (potentialNdc.length >= 10) {
        ndcCode = potentialNdc.substring(0, 10);
      }
    }

    return {
      status: 'success',
      data: {
        barcode,
        ndc: ndcCode,
        type: this.getBarcodeType(barcode)
      }
    };
  }

  /**
   * Determines the type of barcode
   * @param {string} barcode - The scanned barcode
   * @returns {string} - The type of barcode
   */
  getBarcodeType(barcode) {
    if (!barcode) return 'Unknown';

    if (barcode.match(/^\d{4}-\d{4}-\d{2}$|^\d{5}-\d{3}-\d{2}$|^\d{5}-\d{4}-\d{1}$/)) {
      return 'NDC';
    } else if (barcode.match(/^\d{12,13}$/)) {
      return 'UPC';
    } else if (barcode.match(/^\d{8}$/)) {
      return 'EAN-8';
    } else if (barcode.match(/^\d{13}$/)) {
      return 'EAN-13';
    } else if (barcode.match(/^[A-Za-z0-9]+$/)) {
      return 'Code-128';
    }
    return 'Unknown';
  }
}

export default BarcodeService; 