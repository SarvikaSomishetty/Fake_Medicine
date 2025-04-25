import { Card, CardContent, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const InfoCard = ({ icon, title, content }) => {
  return (
    <motion.div whileHover={{ y: -5 }}>
      <Card sx={{ height: '100%', borderRadius: '12px', boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {icon}
          </Box>
          <Typography variant="h6" component="h3" sx={{ mb: 1.5, textAlign: 'center', fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            {content}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InfoCard;