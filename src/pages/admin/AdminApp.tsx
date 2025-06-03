import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront'; // icon khác cho products
import { Admin, Resource } from 'react-admin';
import Dashboard from './Dashboard';
import { OrderList } from './order/OrderList';
import { ProductList } from './product/ProductList';
import ProductEdit from './product/ProductEdit';

import { AdminLayout } from '../../layouts/AdminLayout';

import fakeDataProvider from '../../data/fakeDataProvider';

const AdminApp = () => (
    <Admin 
        basename="/admin"
        dataProvider={fakeDataProvider} 
        dashboard={Dashboard} 
        layout={AdminLayout}
    >
        {/* Không cần Resource cho dashboard */}
        <Resource 
            name="orders" 
            list={OrderList} 
            icon={ShoppingCartIcon}
        />
        <Resource 
            name="products" 
            list={ProductList} 
            edit={ProductEdit}
            icon={StorefrontIcon} 
        />
    </Admin>
);

export default AdminApp;
