import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const textList = [
    'Dola Style xin chào bạn!',
    'Vô vàn khuyến mãi hấp dẫn đang chờ bạn!',
    'Nhanh tay chọn cho mình những sản phẩm ưng ý nhất!',
];

const NavbarTop: React.FC = () => {
    const { role, logout } = useAuth();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % textList.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="navbar-top">
            <div className="navbar-top-left">
                <p className="text-list">{textList[currentTextIndex]}</p>
            </div>
            <div className="navbar-top-right">
                {role === 'client' ? (
                    <>
                        <Button
                            variant="outlined"
                            className="btn-auth btn-logout"
                            onClick={logout}
                        >
                            Đăng xuất
                        </Button>
                        <Button
                            component={Link}
                            to="/profile"
                            variant="contained"
                            className="btn-auth btn-profile"
                        >
                            Tài khoản
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            component={Link}
                            to="/auth?tab=login"
                            variant="outlined"
                            className="btn-auth btn-login"
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            component={Link}
                            to="/auth?tab=register"
                            variant="contained"
                            className="btn-auth btn-register"
                        >
                            Đăng ký
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavbarTop;
