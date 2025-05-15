import React from 'react';
import '../../styles/Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-column">
                    <h4>Chính sách</h4>
                    <ul>
                        <li>Chính sách thành viên</li>
                        <li>Chính sách thanh toán</li>
                        <li>Chính sách vận chuyển vào giao nhận</li>
                        <li>Bảo mật thông tin cá nhân</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Hướng dẫn</h4>
                    <ul>
                        <li>Hướng dẫn mua hàng</li>
                        <li>Hướng dẫn thanh toán</li>
                        <li>Hướng dẫn giao nhận</li>
                        <li>Điều khoản dịch vụ</li>
                        <li>Câu hỏi thường gặp</li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Thông tin liên hệ</h4>
                    <p>
                        Công ty TNHH Dola Style chuyên sản xuất - phân phối - bán lẻ thời trang nữ.<br />
                        Mã số thuế: 123456xxxx - Ngày cấp: 13/05/2024 - Nơi cấp: Sở Kế hoạch và Đầu tư TPHCM - Website: <a href="#">dola-style.mysapo.net</a>
                    </p>
                    <p><strong>Địa chỉ:</strong> 70 Lữ Gia, Phường 15, Quận 11, TP.HCM</p>
                    <p><strong>Điện thoại:</strong> 1900 6750</p>
                    <p><strong>Email:</strong> support@sapo.vn</p>
                    <div className="footer-social">
                        <h4>Mạng xã hội</h4>
                        <div className="ecommerce-links">
                            <img src="/assets/icons/shopee.png" alt="Shopee" />
                            <img src="/assets/icons/lazada.png" alt="Lazada" />
                            <img src="/assets/icons/tiki.png" alt="Tiki" />
                            <img src="/assets/icons/sendo.png" alt="Sendo" />
                        </div>
                    </div>
                </div>
                <div className="footer-column">
                    <h4>Nhận tin khuyến mãi</h4>
                    <div className="footer-subscribe">
                        <input type="email" placeholder="Nhập email nhận tin khuyến mãi" />
                        <button>ĐĂNG KÝ</button>
                    </div>
                    <h4>Liên kết sàn</h4>
                    <div className="ecommerce-links">
                        <img src="/assets/icons/shopee.png" alt="Shopee" />
                        <img src="/assets/icons/lazada.png" alt="Lazada" />
                        <img src="/assets/icons/tiki.png" alt="Tiki" />
                        <img src="/assets/icons/sendo.png" alt="Sendo" />
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <img src="/assets/images/logo.webp" alt="logo" className='footer-logo'/>
                <p>
                    Dola Style không chỉ là một cửa hàng thời trang nữ đơn thuần, mà còn là điểm đến lý tưởng cho những cô gái đam mê thời trang, yêu thích sự sang trọng và đẳng cấp...
                </p>
            </div>
        </footer>
    );
};

export default Footer;
