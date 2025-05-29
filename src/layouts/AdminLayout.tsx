import { Layout } from 'react-admin';
import MyMenu from '../components/Admin/MyMenu';
import { CustomAppBar } from '../components/Admin/CustomAppBar';

const AdminLayout = (props: any) => (
  <Layout
    {...props}
    appBar={CustomAppBar}
    menu={MyMenu}
    sx={{
      // Xóa padding và margin mặc định
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      m: 0,
      p: 0,
    }}
  />
);

export default AdminLayout;
