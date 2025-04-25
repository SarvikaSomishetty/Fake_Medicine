import { 
    Box, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Divider,
    Alert,
    List,
    ListItem,
    ListItemText,
    CircularProgress
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
  
  const Result = ({ result, onRetry }) => {
    if (!result) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }
  
    const { status, confidence, reasons, verification, imageAnalysis } = result;
  
    const getResultContent = () => {
      switch (status) {
        case 'authentic':
          return {
            icon: <VerifiedIcon sx={{ fontSize: 80, color: 'success.main' }} />,
            title: 'Medicine Verified',
            message: 'This product is authentic and registered in pharmaceutical databases.',
            color: 'success.main',
            secondaryColor: 'success.light'
          };
        case 'counterfeit':
          return {
            icon: <WarningIcon sx={{ fontSize: 80, color: 'error.main' }} />,
            title: 'Counterfeit Detected',
            message: 'Warning! This product could not be verified and may be counterfeit.',
            color: 'error.main',
            secondaryColor: 'error.light'
          };
        case 'suspicious':
          return {
            icon: <WarningIcon sx={{ fontSize: 80, color: 'warning.main' }} />,
            title: 'Suspicious Product',
            message: 'This product shows some signs of being counterfeit. Please verify carefully.',
            color: 'warning.main',
            secondaryColor: 'warning.light'
          };
        default:
          return {
            icon: <ErrorIcon sx={{ fontSize: 80, color: 'text.secondary' }} />,
            title: 'Verification Error',
            message: 'Unable to verify this product. Please try again.',
            color: 'text.secondary',
            secondaryColor: 'grey.300'
          };
      }
    };
  
    const { icon, title, message, color, secondaryColor } = getResultContent();
  
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
  
          {/* Confidence Score */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Confidence Score: {Math.round(confidence * 100)}%
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: '10px', 
              bgcolor: 'grey.200', 
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${confidence * 100}%`, 
                height: '100%', 
                bgcolor: color,
                transition: 'width 0.5s ease-in-out'
              }} />
            </Box>
          </Box>
  
          {/* Verification Details */}
          {verification && verification.medicine && (
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <LocalPharmacyIcon sx={{ mr: 1, color: color }} />
                  Product Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Name</Typography>
                    <Typography>{verification.medicine.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Manufacturer</Typography>
                    <Typography>{verification.medicine.manufacturer}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>NDC</Typography>
                    <Typography>{verification.medicine.ndc}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Dosage Form</Typography>
                    <Typography>{verification.medicine.dosageForm}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
  
          {/* Reasons for Status */}
          {reasons && reasons.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Reasons:
              </Typography>
              <List>
                {reasons.map((reason, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={reason} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
  
          {/* Image Analysis Results */}
          {imageAnalysis && imageAnalysis.status === 'success' && (
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Image Analysis Results
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Quality Score</Typography>
                    <Typography>{Math.round(imageAnalysis.analysis.qualityScore * 100)}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Text Clarity</Typography>
                    <Typography>{Math.round(imageAnalysis.analysis.textClarity * 100)}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Print Quality</Typography>
                    <Typography>{Math.round(imageAnalysis.analysis.printQuality * 100)}%</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Security Features</Typography>
                    <Typography>{Math.round(imageAnalysis.analysis.securityFeatures * 100)}%</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
  
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