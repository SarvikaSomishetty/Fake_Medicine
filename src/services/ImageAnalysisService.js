class ImageAnalysisService {
  constructor() {
    this.API_URL = process.env.REACT_APP_IMAGE_ANALYSIS_API_URL || 'http://localhost:5000/api/analyze';
  }

  /**
   * Analyzes an image for potential counterfeit indicators
   * @param {File} imageFile - The image file to analyze
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      return {
        status: 'success',
        analysis: {
          qualityScore: data.quality_score,
          textClarity: data.text_clarity,
          logoDetection: data.logo_detection,
          colorConsistency: data.color_consistency,
          printQuality: data.print_quality,
          securityFeatures: data.security_features,
          overallScore: data.overall_score
        }
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      return {
        status: 'error',
        message: 'Failed to analyze image'
      };
    }
  }

  /**
   * Determines if an image shows signs of being counterfeit
   * @param {Object} analysis - The analysis results
   * @returns {Object} - Counterfeit assessment
   */
  assessCounterfeit(analysis) {
    const {
      qualityScore,
      textClarity,
      logoDetection,
      colorConsistency,
      printQuality,
      securityFeatures,
      overallScore
    } = analysis;

    // Define thresholds for counterfeit detection
    const thresholds = {
      qualityScore: 0.7,
      textClarity: 0.8,
      logoDetection: 0.9,
      colorConsistency: 0.85,
      printQuality: 0.75,
      securityFeatures: 0.8,
      overallScore: 0.8
    };

    // Count the number of indicators below threshold
    let indicators = 0;
    let total = 0;

    if (qualityScore < thresholds.qualityScore) {
      indicators++;
    }
    total++;

    if (textClarity < thresholds.textClarity) {
      indicators++;
    }
    total++;

    if (logoDetection < thresholds.logoDetection) {
      indicators++;
    }
    total++;

    if (colorConsistency < thresholds.colorConsistency) {
      indicators++;
    }
    total++;

    if (printQuality < thresholds.printQuality) {
      indicators++;
    }
    total++;

    if (securityFeatures < thresholds.securityFeatures) {
      indicators++;
    }
    total++;

    // Calculate the percentage of indicators below threshold
    const percentageBelowThreshold = (indicators / total) * 100;

    // Determine the risk level
    let riskLevel;
    if (percentageBelowThreshold > 50) {
      riskLevel = 'high';
    } else if (percentageBelowThreshold > 25) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    return {
      status: 'success',
      assessment: {
        riskLevel,
        percentageBelowThreshold,
        indicators: {
          qualityScore: qualityScore < thresholds.qualityScore,
          textClarity: textClarity < thresholds.textClarity,
          logoDetection: logoDetection < thresholds.logoDetection,
          colorConsistency: colorConsistency < thresholds.colorConsistency,
          printQuality: printQuality < thresholds.printQuality,
          securityFeatures: securityFeatures < thresholds.securityFeatures
        },
        overallScore
      }
    };
  }

  /**
   * Processes an image and returns a complete analysis
   * @param {File} imageFile - The image file to process
   * @returns {Promise<Object>} - Complete analysis results
   */
  async processImage(imageFile) {
    const analysisResult = await this.analyzeImage(imageFile);
    
    if (analysisResult.status === 'success') {
      return this.assessCounterfeit(analysisResult.analysis);
    }

    return analysisResult;
  }
}

export default ImageAnalysisService; 