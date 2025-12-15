import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import ClientLayout from './layouts/ClientLayout';
import { adminRoutes, clientRoutes } from './routes';
import PrivateRoute from './routes/PrivateRoute';
import { loadGuestCart } from './store/cartSlice';
import { useAppDispatch } from './store/hooks';
import { loadGuestWishlist } from './store/wishlistSlice';

const App: React.FC = () => {
    const { userId, loading } = useAuth();
    const dispatch = useAppDispatch();

    // Load guest cart and wishlist from localStorage when app starts (for non-logged-in users)
    useEffect(() => {
        if (!loading && !userId) {
            dispatch(loadGuestCart());
            dispatch(loadGuestWishlist());
        }
    }, [loading, userId, dispatch]);

    return (
        <Routes>


            {/* Client layout */}
            <Route path="/" element={<ClientLayout />}>
                {clientRoutes.map(({ path, element, auth }, index) => {
                    const routePath = path === '/' ? '' : path.slice(1);
                    const isPrivate = auth === 'client' && (path === '/wishlist' || path === '/cart' || path === '/profile' || path === '/orders');

                    return (
                        <Route
                            key={index}
                            path={routePath}
                            element={isPrivate ? <PrivateRoute element={element} auth="client" /> : element}
                        />
                    );
                })}
            </Route>

            {/* Route riêng cho admin (React-Admin) */}
            {adminRoutes.map(({ path, element }, index) => (
                <Route
                    key={index}
                    path={path}
                    element={<PrivateRoute element={element} auth="admin" />}
                />
            ))}
        </Routes>
    );
};

export default App;
