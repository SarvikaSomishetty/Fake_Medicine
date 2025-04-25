import axios from 'axios';

class OCRService {
  constructor() {
    this.API_URL = process.env.REACT_APP_OCR_API_URL || 'http://localhost:5000/api/ocr';
  }

  /**
   * Extracts text from an image using trOCR
   * @param {File} imageFile - The image file to process
   * @returns {Promise<Object>} - OCR results
   */
  async extractText(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(this.API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        status: 'success',
        text: response.data.text,
        confidence: response.data.confidence
      };
    } catch (error) {
      console.error('Error performing OCR:', error);
      return {
        status: 'error',
        message: 'Failed to extract text from image'
      };
    }
  }

  /**
   * Processes an image and returns structured data
   * @param {File} imageFile - The image file to process
   * @returns {Promise<Object>} - Structured data from the image
   */
  async processImage(imageFile) {
    const ocrResult = await this.extractText(imageFile);
    
    if (ocrResult.status === 'success') {
      // Extract NDC code
      const ndcRegex = /\b\d{4}-\d{4}-\d{2}\b|\b\d{5}-\d{3}-\d{2}\b|\b\d{5}-\d{4}-\d{1}\b/;
      const ndcMatch = ocrResult.text.match(ndcRegex);
      
      // Extract medicine name
      const nameRegex = /(?:Brand|Generic) Name:\s*([^\n]+)/i;
      const nameMatch = ocrResult.text.match(nameRegex);
      
      // Extract manufacturer
      const manufacturerRegex = /Manufacturer:\s*([^\n]+)/i;
      const manufacturerMatch = ocrResult.text.match(manufacturerRegex);

      return {
        status: 'success',
        data: {
          text: ocrResult.text,
          ndc: ndcMatch ? ndcMatch[0] : null,
          name: nameMatch ? nameMatch[1].trim() : null,
          manufacturer: manufacturerMatch ? manufacturerMatch[1].trim() : null,
          confidence: ocrResult.confidence
        }
      };
    }

    return ocrResult;
  }
}

export default OCRService; 