import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import '../../styles/ContactPage.css';

const ContactPage = () => {
    return (
        <Container maxWidth="lg" className="contact-page-container">
            <Box display="flex" flexWrap="wrap" gap={4} mb={5}>
                {/* Left Column: Store Info */}
                <Box className="contact-info-column">
                    <Typography variant="h4" className="contact-title">
                        Cửa hàng Dola Style
                    </Typography>
                    <Typography variant="body1" paragraph className="contact-description">
                        Dola Style không chỉ là một cửa hàng thời trang nữ đơn thuần, mà còn là điểm đến lý tưởng cho những cô gái đam mê thời trang, yêu thích sự sang trọng và đẳng cấp. Với một sứ mệnh tôn vinh vẻ đẹp và phong cách riêng biệt của mỗi người phụ nữ, Dola Style đã trở thành biểu tượng của sự uy tín và chất lượng trong ngành thời trang.
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
                        <Box className="contact-item-box">
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box className="contact-icon-circle">
                                    <LocationOnIcon />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                    <Typography variant="subtitle1" className="contact-label">Địa chỉ</Typography>
                                    <Typography variant="body2" className="contact-text">
                                        70 Lữ Gia, Phường 15, Quận 11, TP.HCM
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="contact-item-box">
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box className="contact-icon-circle">
                                    <AccessTimeIcon />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                    <Typography variant="subtitle1" className="contact-label">Thời gian làm việc</Typography>
                                    <Typography variant="body2" className="contact-text">
                                        8h - 22h
                                    </Typography>
                                    <Typography variant="body2" className="contact-text">
                                        Từ thứ 2 đến chủ nhật
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="contact-item-box">
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box className="contact-icon-circle">
                                    <PhoneIcon />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                    <Typography variant="subtitle1" className="contact-label">Hotline</Typography>
                                    <Typography variant="body2" className="contact-text">
                                        1900 6750
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box className="contact-item-box">
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box className="contact-icon-circle">
                                    <EmailIcon />
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                    <Typography variant="subtitle1" className="contact-label">Email</Typography>
                                    <Typography variant="body2" className="contact-text">
                                        support@sapo.vn
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Right Column: Contact Form */}
                <Box className="contact-info-column">
                    <Typography variant="h4" className="contact-title">
                        Liên hệ với chúng tôi
                    </Typography>
                    <Typography variant="body1" paragraph className="contact-description">
                        Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể.
                    </Typography>

                    <Box component="form" noValidate autoComplete="off">
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            variant="outlined"
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Điện thoại*"
                            variant="outlined"
                            margin="normal"
                            size="small"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Nội dung"
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                            size="small"
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            className="contact-submit-btn"
                        >
                            Gửi thông tin
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Google Maps Section */}
            <Box className="google-map-container">
                <Paper elevation={1} className="google-map-paper">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044334!2d105.81156881476332!3d21.03812779283556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3428d02c77%3A0x6bba31d4715f3cb9!2zUGjhuqduIG3hu4FtIHF14bqjbiBsw70gYsOhbiBow6BuZyAtIFNhcG8gUE9T!5e0!3m2!1svi!2s!4v1647424600000!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        className="google-map-iframe"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Sapo POS Map"
                    ></iframe>
                </Paper>
            </Box>
        </Container>
    );
};

export default ContactPage;

