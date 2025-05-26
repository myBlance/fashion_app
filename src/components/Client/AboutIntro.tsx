import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const AboutIntro: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundImage: 'url(/assets/images/paper-bg.jpg)', // ảnh nền giấy
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                p: 4,
                width: '75%',
                ml: '10%',
                flexWrap: 'wrap',
            }}
        >
        {/* Left content */}
            <Box sx={{ maxWidth: 700 }}>
                <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
                    Về chúng tôi
                </Typography>
                <Typography variant="body1" mb={2}>
                    Dola Style không chỉ là một cửa hàng thời trang nữ đơn thuần, mà còn là điểm đến lý tưởng cho những cô gái đam mê thời trang, yêu thích sự sang trọng và đẳng cấp. Với một sứ mệnh tôn vinh vẻ đẹp và phong cách riêng biệt của mỗi người phụ nữ, Dola Style đã trở thành biểu tượng của sự uy tín và chất lượng trong ngành thời trang.
                </Typography>
                <Button variant="contained" color="error">
                    Xem thêm
                </Button>
            </Box>

            {/* Right logo */}
            <Box
                component="img"
                src="/assets/images/logo.webp" // logo
                alt="DolaStyle logo"
                sx={{ width: { xs: '100%', sm: 'auto' }, maxHeight: 80, mt: { xs: 3, sm: 0 } }}
            />
        </Box>
    );
};

export default AboutIntro;
