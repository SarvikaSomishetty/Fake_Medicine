import axios from 'axios';

class MedicineVerifier {
  constructor() {
    this.OPENFDA_API_URL = 'https://api.fda.gov/drug/ndc.json';
    this.API_KEY = process.env.REACT_APP_OPENFDA_API_KEY;
  }

  /**
   * Verifies a medicine using NDC code
   * @param {string} ndcCode - The NDC code to verify
   * @returns {Promise<Object>} - Verification result
   */
  async verifyByNDC(ndcCode) {
    try {
      const response = await axios.get(this.OPENFDA_API_URL, {
        params: {
          api_key: this.API_KEY,
          search: `product_ndc:"${ndcCode}"`,
          limit: 1
        }
      });

      const results = response.data.results;
      
      if (results && results.length > 0) {
        const medicine = results[0];
        return {
          status: 'verified',
          medicine: {
            name: medicine.brand_name || medicine.generic_name,
            manufacturer: medicine.manufacturer_name,
            ndc: medicine.product_ndc,
            activeIngredients: medicine.active_ingredients,
            dosageForm: medicine.dosage_form,
            route: medicine.route,
            marketingStatus: medicine.marketing_status
          }
        };
      }

      return {
        status: 'counterfeit',
        reason: 'NDC code not found in FDA database'
      };
    } catch (error) {
      console.error('Error verifying medicine:', error);
      return {
        status: 'error',
        message: 'Failed to verify medicine'
      };
    }
  }

  /**
   * Searches for medicine by name
   * @param {string} name - The medicine name to search for
   * @returns {Promise<Object>} - Search results
   */
  async searchByName(name) {
    try {
      const response = await axios.get(this.OPENFDA_API_URL, {
        params: {
          api_key: this.API_KEY,
          search: `brand_name:"${name}" OR generic_name:"${name}"`,
          limit: 5
        }
      });

      const results = response.data.results;
      
      if (results && results.length > 0) {
        return {
          status: 'success',
          matches: results.map(medicine => ({
            name: medicine.brand_name || medicine.generic_name,
            manufacturer: medicine.manufacturer_name,
            ndc: medicine.product_ndc,
            activeIngredients: medicine.active_ingredients,
            dosageForm: medicine.dosage_form
          }))
        };
      }

      return {
        status: 'not_found',
        message: 'No matching medicines found'
      };
    } catch (error) {
      console.error('Error searching medicine:', error);
      return {
        status: 'error',
        message: 'Failed to search medicine'
      };
    }
  }

  /**
   * Analyzes text extracted from medicine packaging
   * @param {string} text - The extracted text
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeText(text) {
    // Extract potential NDC code using regex
    const ndcRegex = /\b\d{4}-\d{4}-\d{2}\b|\b\d{5}-\d{3}-\d{2}\b|\b\d{5}-\d{4}-\d{1}\b/;
    const ndcMatch = text.match(ndcRegex);
    
    if (ndcMatch) {
      return this.verifyByNDC(ndcMatch[0]);
    }

    // If no NDC found, try to extract medicine name
    const nameRegex = /(?:Brand|Generic) Name:\s*([^\n]+)/i;
    const nameMatch = text.match(nameRegex);
    
    if (nameMatch) {
      return this.searchByName(nameMatch[1].trim());
    }

    return {
      status: 'unable_to_verify',
      message: 'Could not extract NDC code or medicine name from text'
    };
  }

  /**
   * Verifies medicine using multiple methods
   * @param {Object} input - Input data containing barcode, text, or name
   * @returns {Promise<Object>} - Verification results
   */
  async verifyMedicine(input) {
    const { barcode, text, name } = input;
    
    if (barcode) {
      return this.verifyByNDC(barcode);
    }
    
    if (text) {
      return this.analyzeText(text);
    }
    
    if (name) {
      return this.searchByName(name);
    }

    return {
      status: 'error',
      message: 'No valid input provided'
    };
  }
}

export default MedicineVerifier; 