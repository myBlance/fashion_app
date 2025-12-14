import {
  AttachMoney,
  Inventory,
  People,
  ShoppingCart,
  TrendingUp
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomAppBar } from '../../../components/Admin/CustomAppBar';
import '../../../styles/Dashboard.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface DashboardStats {
  totalRevenue: number;
  totalProfit: number; // Added profit
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  ordersByStatus: { [key: string]: number };
  revenueByDate: Array<{ _id: string; revenue: number; profit: number; orders: number }>; // Added profit
  topProducts: Array<{ productId: string; name: string; image: string; soldQuantity: number }>;

  recentOrders: Array<{
    id: string;
    customerName: string;
    totalPrice: number;
    status: string;
    createdAt: string;
    paymentMethod: string;
  }>;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
  <Paper elevation={2} className="stat-card-paper" sx={{ borderLeft: `4px solid ${color}` }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" className="stat-card-title">{title}</Typography>
        <Typography variant="h4" className="stat-card-value">{value}</Typography>
      </Box>
      <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
    </Box>
  </Paper>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Chờ xác nhận',
      awaiting_payment: 'Chờ thanh toán',
      paid: 'Đã thanh toán',
      processing: 'Đang xử lý',
      shipped: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string): "default" | "warning" | "success" | "info" | "error" => {
    const colors: { [key: string]: "default" | "warning" | "success" | "info" | "error" } = {
      pending: 'warning',
      awaiting_payment: 'warning',
      paid: 'success',
      processing: 'info',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography>Không thể tải dữ liệu dashboard</Typography>;
  }

  // Prepare chart data
  const revenueChartData = stats.revenueByDate.map(item => ({
    date: new Date(item._id).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    profit: item.profit,
    orders: item.orders
  }));

  const orderStatusPieData = Object.entries(stats.ordersByStatus).map(([status, count]) => ({
    name: getStatusLabel(status),
    value: count
  }));

  const COLORS = ['#ff9800', '#4caf50', '#2196f3', '#f44336', '#9c27b0', '#00bcd4'];

  return (
    <Card className="dashboard-card">
      <Box className="dashboard-card-content">
        <CustomAppBar />
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" mb={{ xs: 2, sm: 3 }} mt={2}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box display="flex" gap={{ xs: 2, sm: 3 }} mb={{ xs: 3, sm: 4 }} flexWrap="wrap">
          <Box flex="1" minWidth={{ xs: '100%', sm: '45%', md: '200px' }}>
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(stats.totalRevenue)}
              icon={<AttachMoney sx={{ fontSize: 40 }} />}
              color="#4caf50"
            />
          </Box>
          <Box flex="1" minWidth={{ xs: '100%', sm: '45%', md: '200px' }}>
            <StatCard
              title="Tổng lợi nhuận"
              value={formatCurrency(stats.totalProfit)}
              icon={<TrendingUp sx={{ fontSize: 40 }} />}
              color="#ff9800"
            />
          </Box>
          <Box flex="1" minWidth={{ xs: '100%', sm: '45%', md: '200px' }}>
            <StatCard
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              icon={<ShoppingCart sx={{ fontSize: 40 }} />}
              color="#2196f3"
            />
          </Box>
          <Box flex="1" minWidth={{ xs: '100%', sm: '45%', md: '200px' }}>
            <StatCard
              title="Sản phẩm"
              value={stats.totalProducts}
              icon={<Inventory sx={{ fontSize: 40 }} />}
              color="#ff9800"
            />
          </Box>
          <Box flex="1" minWidth={{ xs: '100%', sm: '45%', md: '200px' }}>
            <StatCard
              title="Người dùng"
              value={stats.totalUsers}
              icon={<People sx={{ fontSize: 40 }} />}
              color="#9c27b0"
            />
          </Box>
        </Box>

        {/* Charts */}
        <Box display="flex" gap={{ xs: 2, sm: 3 }} mb={{ xs: 3, sm: 4 }} flexWrap="wrap">
          {/* Revenue Chart */}
          <Box flex="2" minWidth={{ xs: '100%', md: '300px' }}>
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>Doanh thu & Lợi nhuận 7 ngày qua</Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  {!isMobile && <Legend />}
                  <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} name="Doanh thu" />
                  <Line type="monotone" dataKey="profit" stroke="#ff9800" strokeWidth={2} name="Lợi nhuận" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Pie Chart */}
          <Box flex="1" minWidth={{ xs: '100%', md: '280px' }}>
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>Trạng thái đơn hàng</Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                <PieChart>
                  <Pie
                    data={orderStatusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={isMobile ? false : ({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={isMobile ? 60 : 80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusPieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  {isMobile && <Legend />}
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Tables */}
        <Box display="flex" gap={{ xs: 2, sm: 3 }} flexWrap="wrap">
          {/* Top Products */}
          <Box flex="1" minWidth={{ xs: '100%', md: '350px' }}>
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>Top 5 sản phẩm bán chạy</Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đã bán</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topProducts.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img src={product.image} alt={product.name} className="table-product-image" style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }} />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{product.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={product.soldQuantity} color="primary" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Recent Orders */}
          <Box flex="1" minWidth={{ xs: '100%', md: '350px' }}>
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>Đơn hàng gần đây</Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã</TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Khách hàng</TableCell>
                      <TableCell align="right">Giá trị</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{order.id.slice(-6)}</Typography>
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{order.customerName}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>{formatCurrency(order.totalPrice)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
                            sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default Dashboard;
