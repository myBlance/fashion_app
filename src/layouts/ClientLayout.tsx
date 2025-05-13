import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from '../components/Client/Navbar';
import '../styles/ClientLayout.css';

const ClientLayout: React.FC = () => {
    return (
        <div>
            <header>
                <Navbar />
            </header>           
            <main>
                <Outlet /> 
                {/* Sẽ render các trang con như Home, Login, v.v. */}
            </main>
            <footer>
                {/* Footer here */}
                <p>&copy; 2025 Fashion E-commerce</p>
            </footer>
        </div>
    );
};

export default ClientLayout;
