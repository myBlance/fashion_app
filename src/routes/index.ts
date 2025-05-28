import { ReactElement } from 'react';
import React from 'react';

import Home from './../pages/client/Home';

// import Checkout from '../pages/client/Checkout';
// import Register from '../pages/auth/Register';

import Dashboard from '../pages/admin/Dashboard';
import OrderPage from '../pages/admin/Orders';
import ProductDetail from '../pages/client/ProductDetail';
import CartPage from '../pages/client/CartPage';
import WishlistPage from '../pages/client/WishlistPage';
import ShopPage from '../pages/client/ShopPage';
import AboutPage from '../pages/client/AboutPage';
import AuthTabs from '../pages/auth/AuthTabs';
// import Products from '../pages/admin/Products';
// import AddProduct from '../pages/admin/AddProduct';
// import Orders from '../pages/admin/Orders';
// import Users from '../pages/admin/Users';

type RouteItem = {
    path: string;
    element: ReactElement;
    auth: 'admin' | 'client';
};

export const clientRoutes: RouteItem[] = [
    { path: '/', element: React.createElement(Home), auth: 'client' },
    { path: '/product/:id', element: React.createElement(ProductDetail) , auth: 'client' },
    { path: '/shop', element: React.createElement(ShopPage), auth: 'client' },
    { path: '/cart', element: React.createElement(CartPage), auth: 'client' },
    { path: '/wishlist', element: React.createElement(WishlistPage), auth: 'client' },
    { path: '/about', element: React.createElement(AboutPage), auth: 'client' },
    { path: '/auth', element: React.createElement(AuthTabs), auth: 'client' },

    // { path: '/checkout', element: <Checkout />, auth: 'client' },
    // { path: '/register', element: React.createElement(Register), auth: 'client' },
];

export const adminRoutes: RouteItem[] = [
    { path: '/admin/dashboard', element: React.createElement(Dashboard), auth: 'admin' },
    { path: '/admin/orders', element: React.createElement(OrderPage), auth: 'admin' },
    // { path: '/admin/products', element: <Products />, auth: 'admin' },
    // { path: '/admin/products/add', element: <AddProduct />, auth: 'admin' },
    // { path: '/admin/users', element: <Users />, auth: 'admin' },
];
