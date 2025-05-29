import React from 'react';

import { Typography, Paper, Box } from '@mui/material';

const DashBoard: React.FC = () => {
  return (
    <div>
      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h4">Trang chính Dashboard</Typography>
      </Box>
      <Paper sx={{ padding: 3 }}>
        <Typography variant="body1">Đây là nội dung chính của admin.</Typography>
        
      </Paper>
    </div>
  );
};

export default DashBoard;
