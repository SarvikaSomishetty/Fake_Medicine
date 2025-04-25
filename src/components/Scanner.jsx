import { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const Scanner = ({ onDetected, onClose }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);

  // Camera constraints configuration
  const cameraConstraints = {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: "environment", // Use rear camera
    focusMode: "continuous" // Helps with barcode scanning
  };

  const initializeQuagga = async () => {
    try {
      // Check camera permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: cameraConstraints 
      });
      
      // Stop any existing tracks
      stream.getTracks().forEach(track => track.stop());

      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: cameraConstraints,
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"],
        },
        locate: true, // Helps with barcode detection
        frequency: 10 // Check every 10ms
      }, (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          setError(`Camera error: ${err.message}`);
          return;
        }
        setCameraReady(true);
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        stopScanner();
        onDetected?.(code);
      });

    } catch (err) {
      console.error("Camera initialization failed:", err);
      setError(`Camera access denied. Please enable camera permissions.`);
      onClose?.();
    }
  };

  const stopScanner = () => {
    try {
      Quagga.stop();
      setCameraReady(false);
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };

  useEffect(() => {
    if (scanning) {
      initializeQuagga();
    }

    return () => {
      stopScanner();
    };
  }, [scanning]);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: '600px', mx: 'auto' }}>
      {/* Scanner Viewport */}
      <Box 
        ref={scannerRef}
        sx={{
          width: '100%',
          height: '300px',
          bgcolor: scanning ? 'black' : 'grey.200',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative'
        }}
      />

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button 
            onClick={() => {
              setError(null);
              setScanning(true);
            }}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Controls */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!scanning ? (
          <Button
            variant="contained"
            onClick={() => setScanning(true)}
            startIcon={<span className="material-icons">qr_code_scanner</span>}
          >
            Start Camera
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              stopScanner();
              onClose?.();
            }}
          >
            Stop Camera
          </Button>
        )}
      </Box>

      {/* Camera Status */}
      {scanning && !cameraReady && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Initializing camera...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Scanner;