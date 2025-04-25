import { useState, useEffect, useRef } from 'react';
import Quagga from 'quagga';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const Scanner = ({ onDetected, onClose }) => {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [quaggaInitialized, setQuaggaInitialized] = useState(false);

  const initializeQuagga = async () => {
    try {
      await Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          },
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "code_128_reader"]
        },
      }, (err) => {
        if (err) {
          console.error("Quagga init error:", err);
          onClose?.();
          return;
        }
        setQuaggaInitialized(true);
        setCameraReady(true);
        Quagga.start();
      });

      Quagga.onDetected((result) => {
        const code = result.codeResult.code;
        stopScanner();
        onDetected(code);
      });
    } catch (err) {
      console.error("Quagga initialization failed:", err);
      onClose?.();
    }
  };

  const stopScanner = () => {
    if (quaggaInitialized) {
      try {
        Quagga.stop();
        setQuaggaInitialized(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setCameraReady(false);
    setScanning(false);
  };

  useEffect(() => {
    if (scanning && !quaggaInitialized) {
      initializeQuagga();
    }

    return () => {
      stopScanner();
    };
  }, [scanning, quaggaInitialized]);

  const startScanner = () => {
    setScanning(true);
  };

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

      {/* Scanner UI Overlay */}
      {scanning && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '150px',
            border: '3px dashed rgba(25, 118, 210, 0.7)',
            borderRadius: '8px',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Scan Line Animation */}
      {scanning && cameraReady && (
        <motion.div
          animate={{
            y: [0, 150, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '70%',
            height: '3px',
            backgroundColor: '#1976d2',
            borderRadius: '2px',
          }}
        />
      )}

      {/* Controls */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {!scanning ? (
          <Button
            variant="contained"
            onClick={startScanner}
            startIcon={<i className="material-icons">qr_code_scanner</i>}
          >
            Start Scanning
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
            Cancel Scan
          </Button>
        )}
      </Box>

      {scanning && !cameraReady && (
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          {quaggaInitialized ? 'Processing...' : 'Initializing camera...'}
        </Typography>
      )}
    </Box>
  );
};

export default Scanner;