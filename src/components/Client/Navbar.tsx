import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import '/src/styles/Navbar.css'; 
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';

const textList = [
    'Dola Style xin chào bạn!',
    'Vô vàn khuyến mãi hấp dẫn đang chờ bạn!',
    'Nhanh tay chọn cho mình những sản phẩm ưng ý nhất!',
];

const placeholders = [
    'Áo', 
    'Quần jeans', 
    'Giày sneaker',
    'Váy',
];

const Navbar: React.FC = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const navigate = useNavigate();
    // ví dụ state.cart.items là mảng chứa các sản phẩm trong giỏ hàng
    const cartItems = useAppSelector((state) => state.cart.items);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const wishlistItems = useAppSelector((state) => state.wishlist.items);


    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % textList.length);
        }, 2500); // Mỗi 2.5 giây đổi một lần

        return () => clearInterval(interval);
    }, []);

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [typedPlaceholder, setTypedPlaceholder] = useState('');

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];
        let charIndex = 0;

        // Set lại `typedPlaceholder` trước khi bắt đầu gõ mới.
        setTypedPlaceholder(''); 

        const typingInterval = setInterval(() => {
            setTypedPlaceholder((prev) => prev + currentText[charIndex]);
            charIndex++;

            if (charIndex >= currentText.length) {
                clearInterval(typingInterval);
                setTimeout(() => {
                    // Sau khi gõ xong, đợi 3s rồi chuyển sang placeholder khác
                    setTypedPlaceholder('');
                    setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
                }, 3000); // Chờ 3s trước khi chuyển placeholder
            }
        }, 150); // Mỗi ký tự gõ cách nhau 150ms

        return () => clearInterval(typingInterval);
    }, [placeholderIndex]);


    return (
        <div className="navbar">
            {/* Banner Freeship */}
            <div className="navbar-banner">
                <img src="/assets/images/banner_top.webp" alt="" />
            </div>

            {/* Navbar Top */}
            <div className="navbar-top"> 
                <div className="navbar-top-left">
                    <div>
                        <p className='text-list'>{textList[currentTextIndex]}</p>
                    </div>
                </div>
                <div className="navbar-top-right">
                    <button>Đăng nhập</button>
                    <button>Đăng ký</button>
                </div>
            </div>

            {/* Navbar Main */}
            <div className="navbar-main">
                {/* Search */}
                <div className="navbar-search">
                    <input
                        type="text"
                        placeholder={typedPlaceholder}
                        className="navbar-search-input"
                    />
                    <span className="navbar-search-icon">
                        <SearchIcon />
                    </span>
                </div>

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img src="/assets/images/logo.webp" alt="" />
                </Link>

                {/* Icons */}
                <div className="navbar-icons">
                    <div className="navbar-icon">
                        <AssignmentTurnedInOutlinedIcon />
                        <span>Kiểm tra</span>
                    </div>
                    <div className="navbar-icon" 
                        onClick={() => {navigate('/wishlist'); }}
                    >
                        <FavoriteBorderIcon />
                        <span>Yêu thích</span>
                        <span className="navbar-icon-badge">{wishlistItems.length}</span>
                    </div>

                    <div className="navbar-icon"
                        onClick={() => {navigate('/cart'); }}
                    >
                        <ShoppingCartOutlinedIcon />
                        <span>Giỏ hàng</span>
                        <span className="navbar-icon-badge">{totalQuantity}</span>
                    </div>
                </div>
            </div>

            {/* Menu Links */}
            <nav className="navbar-menu">
                <ul>
                    <li>
                        <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
                            Trang chủ
                        </Link>
                    </li>
                    <li>Giới thiệu</li>
                    <li>
                        <Link to="/shop">
                            Sản phẩm
                        </Link>
                    </li>
                    <li>Tin tức</li>
                    <li>Flash sale đồng giá</li>
                    <li>Instagram</li>
                    <li>Câu hỏi thường gặp</li>
                    <li>Liên hệ</li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
