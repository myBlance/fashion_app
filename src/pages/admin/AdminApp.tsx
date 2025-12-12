import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Admin, CustomRoutes, Resource } from 'react-admin';
import { Navigate, Route } from 'react-router-dom';
import dataProvider from '../../data/dataProvider';
import { AdminLayout } from '../../layouts/AdminLayout';
import authProvider from '../auth/authProvider';
import AdminProfilePage from './AdminProfilePage';
import Dashboard from './dashboard/Dashboard';
import { OrderEdit } from './order/OrderEdit';
import { OrderList } from './order/OrderList';
import { ProductCreate } from './product/ProductCreate';
import { ProductEdit } from './product/ProductEdit';
import { ProductList } from './product/ProductList';
import { ReviewList } from './review/ReviewList';
import { ReviewShow } from './review/ReviewShow';
import { VoucherCreate } from './voucher/VoucherCreate';
import { VoucherEdit } from './voucher/VoucherEdit';
import { VoucherList } from './voucher/VoucherList';

const AdminLogin = () => <Navigate to="/auth?tab=login" />;

const AdminApp = () => (
    <Admin
        basename="/admin"
        dataProvider={dataProvider}
        authProvider={authProvider}
        loginPage={AdminLogin}
        dashboard={Dashboard}
        layout={AdminLayout}
    >
        {/* Không cần Resource cho dashboard */}
        <Resource
            name="orders"
            list={OrderList}
            edit={OrderEdit}
            icon={ShoppingCartIcon}
        />
        <Resource
            name="products"
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
            icon={StorefrontIcon}
        />
        <Resource
            name='vouchers'
            list={VoucherList}
            edit={VoucherEdit}
            create={VoucherCreate}
        />
        <Resource
            name="reviews"
            list={ReviewList}
            show={ReviewShow}
        />

        <CustomRoutes>
            <Route path="profile" element={<AdminProfilePage />} />
        </CustomRoutes>
    </Admin>
);

export default AdminApp;
