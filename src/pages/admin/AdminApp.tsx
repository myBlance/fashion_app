import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront'; // icon khác cho products
import { Admin, CustomRoutes, Resource } from 'react-admin';
import Dashboard from './Dashboard';
import { OrderList } from './order/OrderList';
import { ProductList } from './product/ProductList';
import { ProductEdit } from './product/ProductEdit';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ProductCreate } from './product/ProductCreate';
import { OrderShow } from './order/OrderShow';
import AdminProfilePage from './AdminProfilePage';
import { Route } from 'react-router-dom';
import dataProvider from '../../data/dataProvider';

const AdminApp = () => (
    <Admin 
        basename="/admin"
        dataProvider={dataProvider} 
        dashboard={Dashboard} 
        layout={AdminLayout}
    >
        {/* Không cần Resource cho dashboard */}
        <Resource 
            name="orders" 
            list={OrderList} 
            show={OrderShow}
            icon={ShoppingCartIcon}
        />
        <Resource 
            name="products" 
            list={ProductList} 
            edit={ProductEdit}
            create={ProductCreate}
            icon={StorefrontIcon} 
        />
        <CustomRoutes>
            <Route path="profile" element={<AdminProfilePage />} />
        </CustomRoutes>
    </Admin>
);

export default AdminApp;
