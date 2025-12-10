import React, { ReactElement } from 'react';

import Home from './../pages/client/Home';

// import Checkout from '../pages/client/Checkout';
// import Register from '../pages/auth/Register';

// import OrderPage from '../pages/admin/Orders';
import AuthTabs from '../pages/auth/AuthTabs';
import AboutPage from '../pages/client/AboutPage';
import CartPage from '../pages/client/CartPage';
import ProductDetail from '../pages/client/ProductDetail';
import ShopPage from '../pages/client/ShopPage';
import WishlistPage from '../pages/client/WishlistPage';

// import OrderList from '../pages/admin/OrderList';
// import ProductList from '../pages/admin/ProductList';
import CODPaymentPage from '../components/Client/Pay/CODPaymentPage';
import SeepayPaymentPage from '../components/Client/Pay/SeepayPayment';
import ShopeePayPayment from '../components/Client/Pay/ShopeePayPayment';
import AdminApp from '../pages/admin/AdminApp';
import ProfilePage from '../pages/auth/ProfilePage';
import BlogPage from '../pages/client/BlogPage';
import CheckoutPage from '../pages/client/Checkout';
import ContactPage from '../pages/client/ContactPage';
import OrderHistoryPage from '../pages/client/OrderHistoryPage';
// import AdminApp from '../pages/admin/AdminApp';
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
    { path: '/product/:id', element: React.createElement(ProductDetail), auth: 'client' },
    { path: '/shop', element: React.createElement(ShopPage), auth: 'client' },
    { path: '/orders', element: React.createElement(OrderHistoryPage), auth: 'client' },
    { path: '/cart', element: React.createElement(CartPage), auth: 'client' },
    { path: '/wishlist', element: React.createElement(WishlistPage), auth: 'client' },
    { path: '/about', element: React.createElement(AboutPage), auth: 'client' },
    { path: '/auth', element: React.createElement(AuthTabs), auth: 'client' },
    { path: '/profile', element: React.createElement(ProfilePage), auth: 'client' },
    { path: '/checkout', element: React.createElement(CheckoutPage), auth: 'client' },
    { path: '/payment/shopeepay', element: React.createElement(ShopeePayPayment), auth: 'client' },
    { path: '/payment/seepay', element: React.createElement(SeepayPaymentPage), auth: 'client' },
    { path: '/payment/cod', element: React.createElement(CODPaymentPage), auth: 'client' },


    { path: '/blog', element: React.createElement(BlogPage), auth: 'client' },
    { path: '/contact', element: React.createElement(ContactPage), auth: 'client' },
];

export const adminRoutes: RouteItem[] = [
    // { path: '/admin/dashboard', element: React.createElement(Dashboard), auth: 'admin' },
    // { path: '/admin/orders', element: React.createElement(OrderList), auth: 'admin' },
    // { path: '/admin/products', element: React.createElement(ProductList), auth: 'admin' },
    { path: '/admin/*', element: React.createElement(AdminApp), auth: 'admin' },
    // { path: '/admin/products/add', element: <AddProduct />, auth: 'admin' },
    // { path: '/admin/users', element: <Users />, auth: 'admin' },
];
