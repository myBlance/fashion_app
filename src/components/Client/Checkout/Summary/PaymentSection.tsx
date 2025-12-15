import React from 'react';

interface PaymentSectionProps {
    selectedPaymentMethod: string;
    setSelectedPaymentMethod: (method: string) => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ selectedPaymentMethod, setSelectedPaymentMethod }) => {
    // 1. Render
    return (
        <div className="section payment-section">
            <div className="section-header">
                <h3>Phương Thức Thanh Toán</h3>
            </div>
            <div className="payment-methods">
                <div className="payment-method">
                    <input
                        type="radio"
                        id="shopeepay"
                        name="payment"
                        value="shopeepay"
                        checked={selectedPaymentMethod === 'shopeepay'}
                        onChange={() => setSelectedPaymentMethod('shopeepay')}
                    />
                    <label htmlFor="shopeepay">
                        <img src="/assets/images/shopee.png" alt="ShopeePay" className="payment-icon" />
                        Ví ShopeePay (Đang phát triển)
                    </label>
                </div>

                <div className="payment-method">
                    <input
                        type="radio"
                        id="seepay"
                        name="payment"
                        value="seepay"
                        checked={selectedPaymentMethod === 'seepay'}
                        onChange={() => setSelectedPaymentMethod('seepay')}
                    />
                    <label htmlFor="seepay">
                        <img src="/assets/images/sepay-820x820-blue-icon.webp" alt="SeePay" className="payment-icon" />
                        SePay (Quét QR)
                    </label>
                </div>
                <div className="payment-method">
                    <input
                        type="radio"
                        id="cash-on-delivery"
                        name="payment"
                        value="cash-on-delivery"
                        checked={selectedPaymentMethod === 'cash-on-delivery'}
                        onChange={() => setSelectedPaymentMethod('cash-on-delivery')}
                    />
                    <label htmlFor="cash-on-delivery">
                        <img src="/assets/images/COD.png" alt="Thanh toán khi nhận hàng" className="payment-icon" />
                        Thanh toán khi nhận hàng (COD)
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PaymentSection;
