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

const ContactPage = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Box display="flex" flexWrap="wrap" gap={4} mb={5}>
                {/* Left Column: Store Info */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                    <Typography variant="h4" color="#d32f2f" fontWeight="bold" gutterBottom>
                        Cửa hàng Dola Style
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary" >
                        Dola Style không chỉ là một cửa hàng thời trang nữ đơn thuần, mà còn là điểm đến lý tưởng cho những cô gái đam mê thời trang, yêu thích sự sang trọng và đẳng cấp. Với một sứ mệnh tôn vinh vẻ đẹp và phong cách riêng biệt của mỗi người phụ nữ, Dola Style đã trở thành biểu tượng của sự uy tín và chất lượng trong ngành thời trang.
                    </Typography>

                    <Box display="flex" flexWrap="wrap" gap={3} mt={2}>
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    border: '1px solid #d32f2f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#d32f2f'
                                }}>
                                    <LocationOnIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Địa chỉ</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        70 Lữ Gia, Phường 15, Quận 11, TP.HCM
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    border: '1px solid #d32f2f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#d32f2f'
                                }}>
                                    <AccessTimeIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Thời gian làm việc</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        8h - 22h
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Từ thứ 2 đến chủ nhật
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    border: '1px solid #d32f2f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#d32f2f'
                                }}>
                                    <PhoneIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Hotline</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        1900 6750
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                            <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box sx={{
                                    minWidth: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    border: '1px solid #d32f2f',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#d32f2f'
                                }}>
                                    <EmailIcon />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">Email</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        support@sapo.vn
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Right Column: Contact Form */}
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' } }}>
                    <Typography variant="h4" color="#d32f2f" fontWeight="bold" gutterBottom>
                        Liên hệ với chúng tôi
                    </Typography>
                    <Typography variant="body1" paragraph color="text.secondary">
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
                            sx={{
                                mt: 2,
                                bgcolor: '#b71c1c',
                                '&:hover': { bgcolor: '#d32f2f' },
                                py: 1.5,
                                fontWeight: 'bold'
                            }}
                        >
                            Gửi thông tin
                        </Button>
                    </Box>
                </Box>
            </Box>

            {/* Google Maps Section */}
            <Box mt={5}>
                <Paper elevation={1} sx={{ p: 1, borderRadius: 2 }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044334!2d105.81156881476332!3d21.03812779283556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3428d02c77%3A0x6bba31d4715f3cb9!2zUGjhuqduIG3hu4FtIHF14bqjbiBsw70gYsOhbiBow6BuZyAtIFNhcG8gUE9T!5e0!3m2!1svi!2s!4v1647424600000!5m2!1svi!2s"
                        width="100%"
                        height="450"
                        style={{ border: 0, borderRadius: '8px' }}
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

