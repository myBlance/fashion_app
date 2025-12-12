import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const placeholders = ['Áo', 'Quần', 'Đầm', 'Váy'];

const NavbarSearch: React.FC = () => {
    const navigate = useNavigate();

    // Placeholder typing logic
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [typedPlaceholder, setTypedPlaceholder] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Search logic
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];
        const typingTimer = setTimeout(() => {
            if (!isDeleting) {
                setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length + 1));
                setTypingSpeed(150);
                if (typedPlaceholder === currentText) {
                    setTypingSpeed(1500);
                    setIsDeleting(true);
                }
            } else {
                setTypedPlaceholder(currentText.substring(0, typedPlaceholder.length - 1));
                setTypingSpeed(50);
                if (typedPlaceholder === '') {
                    setIsDeleting(false);
                    setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
                }
            }
        }, typingSpeed);
        return () => clearTimeout(typingTimer);
    }, [typedPlaceholder, isDeleting, placeholderIndex, placeholders]);

    return (
        <div className="navbar-search">
            <input
                type="text"
                placeholder={typedPlaceholder}
                className="navbar-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <span className="navbar-search-icon" onClick={handleSearch} style={{ cursor: 'pointer' }}>
                <SearchIcon />
            </span>
        </div>
    );
};

export default NavbarSearch;
