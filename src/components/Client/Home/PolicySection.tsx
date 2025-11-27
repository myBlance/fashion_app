import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import React from 'react';
import '../../../styles/PolicySection.css';

const PolicySection: React.FC = () => {
    const policies = [
        {
            icon: <CardGiftcardIcon />,
            title: 'Miễn phí vận chuyển',
            description: 'Cho tất cả đơn hàng trong nội thành Hồ Chí Minh',
        },
        {
            icon: <LocalShippingIcon />,
            title: 'Miễn phí đổi - trả',
            description: 'Đổi với sản phẩm lỗi sản xuất hoặc vận chuyển',
        },
        {
            icon: <SwapHorizIcon />,
            title: 'Hỗ trợ nhanh chóng',
            description: 'Gọi Hotline: 1900675015 để được hỗ trợ ngay lập tức',
        },
        {
            icon: <WorkspacePremiumIcon />,
            title: 'Ưu đãi thành viên',
            description: 'Đăng ký thành viên để được nhận được nhiều khuyến mãi',
        },
    ];

    return (
        <section className="policy-section">
            <div className="policy-container">
                <h2 className="policy-title">Chính sách tại Dola Style</h2>
                <p className="policy-subtitle">
                    Với cam kết mang đến sự hài lòng tuyệt đối cho khách hàng, Dola Style chú trọng vào chất lượng sản phẩm và dịch vụ tốt nhất. Chúng tôi cam kết chi bán các sản phẩm chất lượng tốt nhất đến quý khách.
                </p>

                <div className="policy-grid">
                    {policies.map((policy, index) => (
                        <div key={index} className="policy-item">
                            <div className="policy-icon">
                                {policy.icon}
                            </div>
                            <h3 className="policy-item-title">{policy.title}</h3>
                            <p className="policy-item-description">{policy.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PolicySection;
