import React from 'react';
import { Box, Typography } from '@mui/material';

const sections = [
  {
    title: 'Về chúng tôi',
    content:
      'Dola Style hướng đến một cửa hàng thời trang đơn thuần, nơi có thể là điểm đến lý tưởng cho những cô gái đam mê thời trang. Với một sứ mệnh tôn vinh vẻ đẹp và phong cách riêng biệt của mỗi người phụ nữ, Dola Style đã trở thành biểu tượng của sự uy tín và chất lượng trong ngành thời trang.',
    image: '/assets/images/about_1.webp',
     reverse: true,
  },
  {
    title: 'Uy Tín và Chất Lượng',
    content:
      'Dola Style tự hào là địa chỉ tin cậy của hàng ngàn khách hàng. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng tốt nhất, từ thiết kế tinh tế cho đến khâu đóng gói và giao hàng chuyên nghiệp.',
    image: '/assets/images/about_1.webp',
   
  },
  {
    title: 'Chính Sách',
    content:
      'Dola Style luôn đặt sự hài lòng và lợi ích của khách hàng lên hàng đầu. Chúng tôi không chỉ cung cấp những sản phẩm chất lượng mà còn xây dựng các chính sách hỗ trợ linh hoạt và chuyên nghiệp.',
    image: '/assets/images/about_1.webp',
     reverse: true,
  },
  {
    title: 'Đánh Giá từ Khách Hàng',
    content:
      '“Thời trang tại Dola Style không chỉ là mặc, mà là cảm nhận về sự tinh tế và đẳng cấp.” – Ngọc Trinh\n“Dola Style không chỉ đáng tin cậy mà còn rất tận tâm trong tư vấn và hỗ trợ khách hàng.” – Hồng Vân',
    image: '/assets/images/about_1.webp',
    
  },
  {
    title: 'Chính sách tại Dola Style',
    content:
      'Với cam kết đem lại sự hài lòng tuyệt đối cho khách hàng, Dola Style xây dựng hệ thống chăm sóc khách hàng uy tín và chính sách đổi trả rõ ràng, minh bạch.',
    image: '/assets/images/about_1.webp',
    reverse: true,
  },
];

const sections1 = [
    {
        title: 'Chính sách tại Dola Style',
        content:
          'Với cam kết đem lại sự hài lòng tuyệt đối cho khách hàng, Dola Style xây dựng hệ thống chăm sóc khách hàng uy tín và chính sách đổi trả rõ ràng, minh bạch.',
    }
];
const AboutPage: React.FC = () => {
    return (
        <Box p={4}>
            {sections.map((section, index) => (
                <Box
                    key={index}
                    display="flex"
                    flexDirection={section.reverse ? 'row-reverse' : 'row'}
                    alignItems="center"
                    justifyContent="space-between"
                    gap={4}
                    mb={6}
                    flexWrap="wrap"
                    width='75%'
                    justifySelf='center'
                >
                    {/* Image */}
                    <Box
                        component="img"
                        src={section.image}
                        alt={section.title}
                        sx={{
                        width: { xs: '100%', md: '40%' },
                        borderRadius: 2,
                        objectFit: 'cover',
                        maxHeight: 400,
                        }}
                    />

                    {/* Text */}
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="#e92424" mb={1}>
                            {section.title}
                        </Typography>
                        <Typography variant="body1" whiteSpace="pre-line">
                            {section.content}
                        </Typography>
                    </Box>
                </Box>
            ))}
            
            <Box sx={{ flex: 1 }}>
                {sections1.map((section1, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap='3px'
                        mb={6}
                        flexWrap="wrap"
                        width='35%'
                        justifySelf='center'
                        textAlign='center'
                    >

                        <Typography variant="h5" fontWeight="bold" color="#e92424"  mb={1} align='center'>
                            {section1.title}
                        </Typography>
                        <Typography variant="body1" whiteSpace="pre-line">
                            {section1.content}
                        </Typography>
                    </Box>
                ))}
            </Box>

        </Box>
    );
};

export default AboutPage;
