import React from 'react';

interface ShippingSectionProps {
    shippingMethod: string;
    setShippingMethod: (method: string) => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({ shippingMethod, setShippingMethod }) => {
    // Logic helpers
    const getFutureDate = (daysToAdd: number) => {
        const date = new Date();
        date.setDate(date.getDate() + daysToAdd);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    const standardDateStart = getFutureDate(4);
    const standardDateEnd = getFutureDate(6);
    const expressDateStart = getFutureDate(2);
    const expressDateEnd = getFutureDate(3);

    return (
        <div className="section shipping-section">
            <div className="section-header">
                <h3>Phương Thức Vận Chuyển</h3>
            </div>
            <div className="shipping-options">
                <div className="shipping-option">
                    <input
                        type="radio"
                        id="standard-shipping"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                    />
                    <label htmlFor="standard-shipping">
                        <div className="shipping-title">Nhận hàng {standardDateStart} - {standardDateEnd}</div>
                        <div className="shipping-desc">
                            Giao hàng tiết kiệm (4-6 ngày)
                        </div>
                    </label>
                    <div className="shipping-price">16.500₫</div>
                </div>
                <div className="shipping-option">
                    <input
                        type="radio"
                        id="express-shipping"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                    />
                    <label htmlFor="express-shipping">
                        <div className="shipping-title">Nhận hàng {expressDateStart} - {expressDateEnd}</div>
                        <div className="shipping-desc">Giao hàng nhanh (2-3 ngày)</div>
                    </label>
                    <div className="shipping-price">30.000₫</div>
                </div>
            </div>
        </div>
    );
};

export default ShippingSection;
