import React from 'react';
import { Link } from 'react-router-dom';

const NavbarMenu: React.FC = () => {
    return (
        <nav className="navbar-menu">
            <ul>
                <li><Link to="/" className="nav-link">Trang chủ</Link></li>
                <li><Link to="/about" className="nav-link">Giới thiệu</Link></li>
                <li><Link to="/shop" className="nav-link">Sản phẩm</Link></li>
                <li><Link to="/blog" className="nav-link">Blog</Link></li>
                <li><Link to="/contact" className="nav-link">Liên hệ</Link></li>
            </ul>
        </nav>
    );
};

export default NavbarMenu;
