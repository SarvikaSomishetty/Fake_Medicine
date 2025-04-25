import MedicineVerifier from '../models/MedicineVerifier';
import BarcodeService from './BarcodeService';
import OCRService from './OCRService';
import ImageAnalysisService from './ImageAnalysisService';

class MedicineVerificationService {
  constructor() {
    this.medicineVerifier = new MedicineVerifier();
    this.barcodeService = new BarcodeService();
    this.ocrService = new OCRService();
    this.imageAnalysisService = new ImageAnalysisService();
  }

  /**
   * Verifies a medicine using multiple methods
   * @param {Object} input - Input data containing barcode, image, or name
   * @returns {Promise<Object>} - Verification results
   */
  async verifyMedicine(input) {
    const { barcode, image, name } = input;
    let verificationResult = null;
    let imageAnalysisResult = null;

    try {
      // Step 1: Try barcode verification first
      if (barcode) {
        const barcodeData = this.barcodeService.processBarcode(barcode);
        if (barcodeData.status === 'success' && barcodeData.data.ndc) {
          verificationResult = await this.medicineVerifier.verifyByNDC(barcodeData.data.ndc);
        }
      }

      // Step 2: If barcode verification fails or no barcode, try OCR
      if ((!verificationResult || verificationResult.status === 'error') && image) {
        const ocrResult = await this.ocrService.processImage(image);
        if (ocrResult.status === 'success') {
          if (ocrResult.data.ndc) {
            verificationResult = await this.medicineVerifier.verifyByNDC(ocrResult.data.ndc);
          } else if (ocrResult.data.name) {
            verificationResult = await this.medicineVerifier.searchByName(ocrResult.data.name);
          }
        }
      }

      // Step 3: If still no result, try name search
      if ((!verificationResult || verificationResult.status === 'error') && name) {
        verificationResult = await this.medicineVerifier.searchByName(name);
      }

      // Step 4: Perform image analysis if image is provided
      if (image) {
        imageAnalysisResult = await this.imageAnalysisService.processImage(image);
      }

      // Step 5: Format and return results
      return this.formatResults(verificationResult, imageAnalysisResult);
    } catch (error) {
      console.error('Error in verifyMedicine:', error);
      return {
        status: 'error',
        confidence: 0,
        message: 'Failed to verify medicine',
        reasons: [error.message || 'An unexpected error occurred']
      };
    }
  }

  /**
   * Formats the verification and analysis results
   * @param {Object} verificationResult - Medicine verification result
   * @param {Object} imageAnalysisResult - Image analysis result
   * @returns {Object} - Formatted results
   */
  formatResults(verificationResult, imageAnalysisResult) {
    // Default result structure
    let result = {
      status: 'error',
      confidence: 0,
      reasons: [],
      verification: null,
      imageAnalysis: null
    };

    // Handle verification results
    if (verificationResult) {
      if (verificationResult.status === 'success' && verificationResult.matches) {
        // Handle search results
        result.status = verificationResult.matches.length > 0 ? 'authentic' : 'suspicious';
        result.confidence = verificationResult.matches.length > 0 ? 0.8 : 0.2;
        result.verification = {
          medicine: verificationResult.matches[0] || null
        };
        if (verificationResult.matches.length === 0) {
          result.reasons.push('No matching medicines found in database');
        }
      } else if (verificationResult.status === 'verified') {
        // Handle NDC verification results
        result.status = 'authentic';
        result.confidence = 0.9;
        result.verification = {
          medicine: verificationResult.medicine
        };
      } else if (verificationResult.status === 'counterfeit') {
        result.status = 'counterfeit';
        result.confidence = 0.9;
        result.reasons.push(verificationResult.reason || 'Medicine not found in FDA database');
      } else if (verificationResult.status === 'not_found') {
        result.status = 'suspicious';
        result.confidence = 0.5;
        result.reasons.push('Medicine not found in database');
      }
    }

    // Add image analysis results if available
    if (imageAnalysisResult && imageAnalysisResult.status === 'success') {
      result.imageAnalysis = imageAnalysisResult;
      
      // Adjust confidence based on image analysis
      if (imageAnalysisResult.analysis) {
        const { qualityScore, securityFeatures } = imageAnalysisResult.analysis;
        const imageConfidence = (qualityScore + securityFeatures) / 2;
        result.confidence = (result.confidence + imageConfidence) / 2;
      }
    }

    return result;
  }

  /**
   * Initializes the barcode scanner
   * @param {HTMLElement} targetElement - The DOM element to render the scanner
   * @returns {Promise<void>}
   */
  async initializeScanner(targetElement) {
    return this.barcodeService.initialize(targetElement);
  }

  /**
   * Starts the barcode scanner
   * @param {Function} onDetected - Callback function when a barcode is detected
   */
  startScanner(onDetected) {
    this.barcodeService.start(onDetected);
  }

  /**
   * Stops the barcode scanner
   */
  stopScanner() {
    this.barcodeService.stop();
  }
}

export default MedicineVerificationService; 