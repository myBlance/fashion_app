import React from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Navbar from '../components/Client/Navbar';
import Footer from '../components/Client/Footer';

const ClientLayout: React.FC = () => {
    return (
        <div>
            <main>
                <Navbar />
                <Outlet /> 
                {/* render các trang con như Home, Login, v.v. */}
                <Footer/>
            </main>
        </div>
    );
};

export default ClientLayout;
