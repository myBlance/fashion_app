import { Menu } from 'react-admin';
import { Book, People, ShoppingCart } from '@mui/icons-material';

const MyMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.Item to="/orders" primaryText="Order" leftIcon={<ShoppingCart />} />
    <Menu.Item to="/products" primaryText="Product" leftIcon={<Book />} />
    {/* Thêm mục menu khác tại đây */}
  </Menu>
);

export default MyMenu;
