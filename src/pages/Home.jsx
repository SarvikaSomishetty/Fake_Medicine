// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button, Container, Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
// import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import InfoCard from '../components/InfoCard';
// import { motion } from 'framer-motion';

// const Home = () => {
//   const navigate = useNavigate();
//   const [hovered, setHovered] = useState(false);

//   const handleScanClick = () => {
//     navigate('/scan');
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ my: 4, textAlign: 'center' }}>
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
//             Medicine Authenticator
//           </Typography>
//           <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
//             Verify the authenticity of your medications with a simple scan
//           </Typography>
//         </motion.div>

//         <motion.div
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={<VerifiedUserIcon />}
//             onClick={handleScanClick}
//             sx={{
//               py: 2,
//               px: 4,
//               fontSize: '1.1rem',
//               borderRadius: '12px',
//               boxShadow: 3,
//               background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
//             }}
//           >
//             Scan Medicine Barcode
//           </Button>
//         </motion.div>

//         <Grid container spacing={4} sx={{ mt: 6 }}>
//           <Grid item xs={12} md={4}>
//             <InfoCard
//               icon={<MedicalServicesIcon fontSize="large" />}
//               title="How It Works"
//               content="Simply scan the barcode on your medicine package using your device's camera. Our system will verify its authenticity against pharmaceutical databases."
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <InfoCard
//               icon={<VerifiedUserIcon fontSize="large" />}
//               title="Why Verify?"
//               content="Counterfeit medications can be ineffective or even dangerous. Our verification system helps ensure you're getting genuine pharmaceutical products."
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <InfoCard
//               icon={<MedicalServicesIcon fontSize="large" />}
//               title="Database Coverage"
//               content="Our system checks against multiple pharmaceutical databases including openFDA to provide the most accurate verification results."
//             />
//           </Grid>
//         </Grid>
//       </Box>
//     </Container>
//   );
// };

// export default Home;/




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, Grid, Paper, Card, CardContent } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InfoCard from '../components/InfoCard';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const handleScanClick = () => {
    navigate('/scan');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Medicine Authenticator
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
            Verify the authenticity of your medications with a simple scan
          </Typography>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<VerifiedUserIcon />}
            onClick={handleScanClick}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              borderRadius: '12px',
              boxShadow: 3,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            }}
          >
            Scan Medicine Barcode
          </Button>
        </motion.div>

        <Grid container spacing={4} sx={{ mt: 6 }}>
          <Grid xs={12} md={4}>
            <InfoCard
              icon={<MedicalServicesIcon fontSize="large" />}
              title="How It Works"
              content="Simply scan the barcode on your medicine package using your device's camera. Our system will verify its authenticity against pharmaceutical databases."
            />
          </Grid>
          <Grid xs={12} md={4}>
            <InfoCard
              icon={<VerifiedUserIcon fontSize="large" />}
              title="Why Verify?"
              content="Counterfeit medications can be ineffective or even dangerous. Our verification system helps ensure you're getting genuine pharmaceutical products."
            />
          </Grid>
          <Grid xs={12} md={4}>
            <InfoCard
              icon={<MedicalServicesIcon fontSize="large" />}
              title="Database Coverage"
              content="Our system checks against multiple pharmaceutical databases including openFDA to provide the most accurate verification results."
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;