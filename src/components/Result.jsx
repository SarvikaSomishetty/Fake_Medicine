import { 
    Box, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Divider,
    Alert // Added Alert import
  } from '@mui/material';
  import { 
    Verified as VerifiedIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    CalendarToday as CalendarTodayIcon,
    LocalPharmacy as LocalPharmacyIcon
  } from '@mui/icons-material';
  // Note: @mui/icons-material doesn't have a Barcode icon, so we'll use an alternative
  import { motion } from 'framer-motion';
  
  const Result = ({ status, barcode, onRetry }) => {
    const getResultContent = () => {
      switch (status) {
        case 'verified':
          return {
            icon: <VerifiedIcon sx={{ fontSize: 80, color: 'success.main' }} />,
            title: 'Medicine Verified',
            message: 'This product is authentic and registered in pharmaceutical databases.',
            color: 'success.main',
            secondaryColor: 'success.light',
            details: (
              <Box sx={{ mt: 3, width: '100%' }}>
                <Card variant="outlined" sx={{ borderRadius: '12px', mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <LocalPharmacyIcon sx={{ mr: 1, color: 'success.main' }} />
                      Product Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Name</Typography>
                        <Typography>{barcode.details?.name || 'Simulated Medicine'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manufacturer</Typography>
                        <Typography>{barcode.details?.manufacturer || 'Demo Pharma Inc.'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Expiry Date</Typography>
                        <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          {barcode.details?.expiry || '2024-12-31'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Barcode</Typography>
                        <Typography sx={{ fontFamily: 'monospace', fontSize: '1.1rem' }}>
                          {barcode.code}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )
          };
        case 'counterfeit':
          return {
            icon: <WarningIcon sx={{ fontSize: 80, color: 'error.main' }} />,
            title: 'Counterfeit Detected',
            message: 'Warning! This product could not be verified and may be counterfeit.',
            color: 'error.main',
            secondaryColor: 'error.light',
            details: (
              <Box sx={{ mt: 3 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Do not consume this product - consult a pharmacist immediately
                </Alert>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Scanned Barcode: <strong>{barcode.code}</strong>
                </Typography>
              </Box>
            )
          };
        default:
          return {
            icon: <ErrorIcon sx={{ fontSize: 80, color: 'text.secondary' }} />,
            title: 'Verification Error',
            message: 'Unable to verify this product. Please try again.',
            color: 'text.secondary',
            secondaryColor: 'grey.300',
            details: (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Scanned Barcode: <strong>{barcode?.code || 'N/A'}</strong>
                </Typography>
              </Box>
            )
          };
      }
    };
  
    const { icon, title, message, color, secondaryColor, details } = getResultContent();
  
    return (
      <Box sx={{ textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
          <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 1, fontWeight: 600, color }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, maxWidth: '500px', mx: 'auto' }}>
            {message}
          </Typography>
  
          {details}
  
          <Button
            variant="contained"
            onClick={onRetry}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              backgroundColor: secondaryColor,
              '&:hover': {
                backgroundColor: color,
              }
            }}
          >
            Scan Another Product
          </Button>
        </motion.div>
      </Box>
    );
  };
  
  export default Result;