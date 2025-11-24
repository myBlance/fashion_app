import {
  AttachMoney,
  Inventory,
  People,
  ShoppingCart
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
  Typography
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomAppBar } from '../../components/Admin/CustomAppBar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  ordersByStatus: { [key: string]: number };
  revenueByDate: Array<{ _id: string; revenue: number; orders: number }>;
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
  <Paper elevation={2} sx={{ p: 3, borderLeft: `4px solid ${color}`, height: '100%' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </Box>
      <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
    </Box>
  </Paper>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    orders: item.orders
  }));

  const orderStatusPieData = Object.entries(stats.ordersByStatus).map(([status, count]) => ({
    name: getStatusLabel(status),
    value: count
  }));

  const COLORS = ['#ff9800', '#4caf50', '#2196f3', '#f44336', '#9c27b0', '#00bcd4'];

  return (
    <Card sx={{ borderRadius: '20px', mr: '-24px', height: '100%' }}>
      <Box sx={{ padding: 2 }}>
        <CustomAppBar />
        <Typography variant="h4" fontWeight="bold" mb={3} mt={2}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Box display="flex" gap={3} mb={4} flexWrap="wrap">
          <Box flex="1" minWidth="200px">
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(stats.totalRevenue)}
              icon={<AttachMoney sx={{ fontSize: 40 }} />}
              color="#4caf50"
            />
          </Box>
          <Box flex="1" minWidth="200px">
            <StatCard
              title="Tổng đơn hàng"
              value={stats.totalOrders}
              icon={<ShoppingCart sx={{ fontSize: 40 }} />}
              color="#2196f3"
            />
          </Box>
          <Box flex="1" minWidth="200px">
            <StatCard
              title="Sản phẩm"
              value={stats.totalProducts}
              icon={<Inventory sx={{ fontSize: 40 }} />}
              color="#ff9800"
            />
          </Box>
          <Box flex="1" minWidth="200px">
            <StatCard
              title="Người dùng"
              value={stats.totalUsers}
              icon={<People sx={{ fontSize: 40 }} />}
              color="#9c27b0"
            />
          </Box>
        </Box>

        {/* Charts */}
        <Box display="flex" gap={3} mb={4} flexWrap="wrap">
          {/* Revenue Chart */}
          <Box flex="2" minWidth="400px">
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Doanh thu 7 ngày qua</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={2} name="Doanh thu" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>

          {/* Pie Chart */}
          <Box flex="1" minWidth="300px">
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Trạng thái đơn hàng</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusPieData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Tables */}
        <Box display="flex" gap={3} flexWrap="wrap">
          {/* Top Products */}
          <Box flex="1" minWidth="400px">
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Top 5 sản phẩm bán chạy</Typography>
              <TableContainer>
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
                            <img src={product.image} alt={product.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                            <Typography variant="body2">{product.name}</Typography>
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
          <Box flex="1" minWidth="400px">
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>Đơn hàng gần đây</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell align="right">Giá trị</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">{order.id}</Typography>
                        </TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell align="right">{formatCurrency(order.totalPrice)}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(order.status)}
                            color={getStatusColor(order.status)}
                            size="small"
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
