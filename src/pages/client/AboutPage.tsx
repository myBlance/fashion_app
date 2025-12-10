import { Box, Container, Typography } from '@mui/material';
import React from 'react';

const sections = [
  {
    title: 'Về chúng tôi',
    content:
      'Dola Style hướng đến một cửa hàng thời trang đơn thuần, nơi có thể là điểm đến lý tưởng cho những cô gái đam mê thời trang. Với một sứ mệnh tôn vinh vẻ đẹp và phong cách riêng biệt của mỗi người phụ nữ, Dola Style đã trở thành biểu tượng của sự uy tín và chất lượng trong ngành thời trang.',
    image: '/assets/images/about_1.webp',
  },
  {
    title: 'Uy Tín và Chất Lượng',
    content:
      'Dola Style tự hào là địa chỉ tin cậy của hàng ngàn khách hàng. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng tốt nhất, từ thiết kế tinh tế cho đến khâu đóng gói và giao hàng chuyên nghiệp.',
    image: '/assets/images/about_2.webp',
  },
  {
    title: 'Chính Sách',
    content:
      'Dola Style luôn đặt sự hài lòng và lợi ích của khách hàng lên hàng đầu. Chúng tôi không chỉ cung cấp những sản phẩm chất lượng mà còn xây dựng các chính sách hỗ trợ linh hoạt và chuyên nghiệp.',
    image: '/assets/images/about_3.webp',
  },
  {
    title: 'Đánh Giá từ Khách Hàng',
    content:
      '“Thời trang tại Dola Style không chỉ là mặc, mà là cảm nhận về sự tinh tế và đẳng cấp.” – Ngọc Trinh\n“Dola Style không chỉ đáng tin cậy mà còn rất tận tâm trong tư vấn và hỗ trợ khách hàng.” – Hồng Vân',
    image: '/assets/images/about_4.webp',
  },
  {
    title: 'Chính sách tại Dola Style',
    content:
      'Với cam kết đem lại sự hài lòng tuyệt đối cho khách hàng, Dola Style xây dựng hệ thống chăm sóc khách hàng uy tín và chính sách đổi trả rõ ràng, minh bạch.',
    image: '/assets/images/about_1.webp',
  },
];

const AboutPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={10}>
        <Typography variant="h3" fontWeight="900" color="#d32f2f" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Câu Chuyện Về Dola Style
        </Typography>
        <Box sx={{ width: 100, height: 4, bgcolor: '#d32f2f', mx: 'auto', borderRadius: 2 }} />
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mt: 3, fontStyle: 'italic' }}>
          "Nơi vẻ đẹp và phong cách được tôn vinh"
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={10}>
        {sections.map((section, index) => (
          <Box
            key={index}
            display="flex"
            flexWrap="wrap"
            gap={6}
            alignItems="center"
            flexDirection={index % 2 === 1 ? 'row-reverse' : 'row'} // Alternating layout
          >
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 20,
                    left: index % 2 === 1 ? -20 : 20,
                    right: index % 2 === 1 ? 20 : -20,
                    bottom: -20,
                    border: '2px solid #d32f2f',
                    zIndex: 0,
                    borderRadius: 4,
                    opacity: 0.5
                  }
                }}
              >
                <Box
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    },
                    objectFit: 'cover',
                    maxHeight: 400,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 24px)' } }}>
              <Box p={2}>
                <Typography variant="h4" fontWeight="bold" color="#1a1a1a" gutterBottom>
                  {section.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    whiteSpace: 'pre-line',
                    textAlign: 'justify'
                  }}
                >
                  {section.content}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default AboutPage;
