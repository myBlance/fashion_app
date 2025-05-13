import React from 'react';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchIcon from '@mui/icons-material/Search';
import '/src/styles/Navbar.css'; 

const Navbar: React.FC = () => {
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
                        <p>hhhh</p>
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
                        placeholder="Áo"
                        className="navbar-search-input"
                    />
                        <span className="navbar-search-icon">
                        <SearchIcon/>
                    </span>
                </div>
                {/* Logo */}
                <div className="navbar-logo">
                    <img src="/assets/images/logo.webp" alt="" />
                </div>

                {/* Icons */}
                <div className="navbar-icons">
                    <div className="navbar-icon">
                        <AssignmentTurnedInOutlinedIcon/>
                        <span>Kiểm tra</span>
                    </div>
                    <div className="navbar-icon">
                        <FavoriteBorderIcon/>
                        <span>Yêu thích</span>
                        <span className="navbar-icon-badge">0</span>
                    </div>
                    <div className="navbar-icon">
                        <ShoppingCartOutlinedIcon/>
                        <span>Giỏ hàng</span>
                        <span className="navbar-icon-badge">0</span>
                    </div>
                </div>
            </div>
        

            {/* Menu Links */}
            <nav className="navbar-menu">
                <ul>
                    <li>Trang chủ</li>
                    <li>Giới thiệu</li>
                    <li>Sản phẩm</li>
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
