import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

export default {
  async saveScanResult(barcode) {
    // In a real app, this would POST to your backend
    console.log('Saving to MongoDB (simulated):', barcode);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate verification (80% real, 20% fake)
    const isAuthentic = Math.random() > 0.2;
    
    return {
      success: true,
      barcode,
      authentic: isAuthentic,
      timestamp: new Date().toISOString(),
      medicine: isAuthentic ? {
        name: "Simulated Medicine",
        manufacturer: "Demo Pharma Inc.",
        expiry: "2024-12-31"
      } : null
    };
  }
};