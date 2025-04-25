import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, CircularProgress, Card, CardContent, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Scanner from '../components/Scanner';
import Result from '../components/Result';
import { motion } from 'framer-motion';
import api from '../services/api';

const Scan = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const handleScan = async (barcode) => {
    setScanning(false);
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call to backend (replace with real API in production)
      const response = await api.saveScanResult(barcode);
      
      if (response.success) {
        setBarcodeData({
          code: barcode,
          details: response.medicine || null,
          timestamp: response.timestamp
        });
        setResult(response.authentic ? 'verified' : 'counterfeit');
      } else {
        setResult('error');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify medicine. Please try again.');
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setResult(null);
    setBarcodeData(null);
    setError(null);
    setScanning(true);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 2 }}
        variant="outlined"
      >
        Back to Home
      </Button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
          Medicine Verification
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 3 }}>
          Position the barcode within the frame to scan
        </Typography>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: '16px', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Verifying Medicine...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Checking against pharmaceutical databases
              </Typography>
            </Box>
          ) : result ? (
            <Result 
              status={result} 
              barcode={barcodeData} 
              onRetry={handleRetry} 
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Scanner 
                ref={scannerRef}
                onDetected={handleScan}
                onError={(err) => {
                  setError(`Camera error: ${err.message}`);
                  setScanning(false);
                }}
              />
              {!scanning && (
                <Button
                  variant="contained"
                  onClick={() => setScanning(true)}
                  sx={{ mt: 3, px: 4, py: 1.5 }}
                >
                  Restart Scanner
                </Button>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          For best results, scan in well-lit conditions
        </Typography>
      </Box>
    </Container>
  );
};

export default Scan;