import { Admin, Resource } from 'react-admin';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import  Dashboard  from './Dashboard'; 
import { OrderList } from './OrderList'; 
import  ProductList  from './ProductList'; 

import AdminLayout from '../../layouts/AdminLayout'; 

import fakeDataProvider from '../../data/fakeDataProvider'; // Giả lập dataProvider

const AdminApp = () => (
    <Admin 
      dataProvider={fakeDataProvider} 
      dashboard={Dashboard} 
      layout={AdminLayout}
    >
      {/* Resource đại diện các route menu */}
      <Resource name="dashboard" list={Dashboard} icon={DashboardIcon} />
      <Resource name="orders" list={OrderList} icon={ShoppingCartIcon} />
      <Resource name="products" list={ProductList} icon={ShoppingCartIcon} />
    </Admin>
);

export default AdminApp;
