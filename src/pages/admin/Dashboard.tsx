import React from 'react';

import { 
    Box, 
    Card, 
    CardHeader, 
    CardContent, 
} from '@mui/material';
import { CustomAppBar } from '../../components/Admin/CustomAppBar';


const DashBoard: React.FC = () => {
  return (
    <div>
      <Card sx={{borderRadius:"20px", mr:"-24px", height:"100%"}} >
        <Box sx={{ padding: 2 }}>
            <CustomAppBar />
            <CardHeader title="Welcome to the administration" />
            
            <CardContent>
                
                    
               
            </CardContent>
        </Box>
    </Card>
    </div>
  );
};

export default DashBoard;
