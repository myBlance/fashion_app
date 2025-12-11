import React from 'react';

interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
}

interface ProductSectionProps {
    cartItems: CartItem[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ cartItems }) => {
    // 1. Render
    return (
        <div className="section products-section">
            <div className="section-header">
                <h3>Sản phẩm</h3>
            </div>
            <div className="products-list">
                {cartItems.map((item, index) => (
                    <div key={index} className="product-item">
                        <img src={item.image} alt={item.name} />
                        <div className="product-details">
                            <div className="product-name">{item.name}</div>
                            <div className="product-variant">{item.color} / {item.size}</div>
                            <div className="product-price">
                                {(item.price).toLocaleString()}₫ x {item.quantity}
                            </div>
                        </div>
                        <div className="product-total">
                            {(item.price * item.quantity).toLocaleString()}₫
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSection;
