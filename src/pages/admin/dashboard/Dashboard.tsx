import {
  AttachMoney,
  Inventory,
  People,
  ShoppingCart,
  TrendingUp
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
  topProfitProducts: Array<{ productId: string; name: string; image: string; totalProfit: number; soldQuantity: number }>;

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

// Helper for Dashboard Images
const getDashboardImageUrl = (raw: any) => {
  if (!raw) return '/no-image.png';

  let url = raw;

  // 1. Handle Object
  if (typeof url === 'object') {
    url = url.path || url.url || '';
  }

  // 2. Handle Array
  if (Array.isArray(url)) {
    url = url.length > 0 ? url[0] : '';
  }

  if (typeof url !== 'string' || !url) return '/no-image.png';

  // 3. Absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // 4. Normalize
  url = url.replace(/\\/g, '/');
  url = url.replace(/^(\/|uploads\/)+/, '');

  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  return `${baseUrl}/uploads/${url}`;
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7days' | 'month' | 'year' | 'all' | 'custom'>('7days');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [openDateModal, setOpenDateModal] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<string>('');
  const [tempEndDate, setTempEndDate] = useState<string>('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Only fetch if not custom, or if custom with both dates selected
    if (timeRange !== 'custom' || (startDate && endDate)) {
      fetchDashboardStats();
    }
  }, [timeRange, startDate, endDate]); // Refetch when timeRange or dates change

  const fetchDashboardStats = async () => {
    try {
      const params: any = { timeRange };

      // Add custom date parameters if custom range is selected
      if (timeRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
        params
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDateModal = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setOpenDateModal(true);
  };

  const handleCloseDateModal = () => {
    setOpenDateModal(false);
  };

  const handleApplyDateRange = async () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
      setTimeRange('custom');
      setOpenDateModal(false);

      // Fetch immediately with the new dates to avoid state batching issues
      setLoading(true);
      try {
        const params: any = {
          timeRange: 'custom',
          startDate: tempStartDate,
          endDate: tempEndDate
        };

        const response = await axios.get(`${API_BASE_URL}/api/admin/dashboard/stats`, {
          params
        });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      pending: 'Chờ xác nhận',
      awaiting_payment: 'Chờ thanh toán',
      confirmed: 'Đã xác nhận',
      paid: 'Đã thanh toán',
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
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} mb={3} mt={2}>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            Dashboard
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant={timeRange === '7days' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeRange('7days')}
            >
              7 ngày
            </Button>
            <Button
              variant={timeRange === 'month' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeRange('month')}
            >
              Tháng này
            </Button>
            <Button
              variant={timeRange === 'year' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeRange('year')}
            >
              Năm nay
            </Button>
            <Button
              variant={timeRange === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setTimeRange('all')}
            >
              Tất cả
            </Button>
            <Button
              variant={timeRange === 'custom' ? 'contained' : 'outlined'}
              size="small"
              onClick={handleOpenDateModal}
            >
              Tùy chỉnh
            </Button>

          </Box>
        </Box>

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
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>
                Doanh thu & Lợi nhuận {
                  timeRange === '7days' ? '7 ngày qua' :
                    timeRange === 'month' ? 'tháng này' :
                      timeRange === 'year' ? 'năm nay' :
                        'tất cả thời gian'
                }
              </Typography>
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
          {/* Left Column: Top Products */}
          <Box flex="1" minWidth={{ xs: '100%', md: '350px' }} display="flex" flexDirection="column" gap={{ xs: 2, sm: 3 }}>
            {/* Top Selling Products */}
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>Top 10 sản phẩm bán chạy</Typography>
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
                            <img src={getDashboardImageUrl(product.image)} alt={product.name} className="table-product-image" style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }} />
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

            {/* Top Profit Products */}
            <Paper elevation={2} className="chart-paper">
              <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="bold" mb={2}>
                Top 10 sản phẩm lợi nhuận cao nhất
              </Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Lợi nhuận</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.topProfitProducts.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={getDashboardImageUrl(product.image)}
                              alt={product.name}
                              className="table-product-image"
                              style={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }}
                            />
                            <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {product.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={formatCurrency(product.totalProfit)}
                            color="success"
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

          {/* Right Column: Recent Orders */}
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

      {/* Custom Date Range Modal */}
      <Dialog
        open={openDateModal}
        onClose={handleCloseDateModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Chọn khoảng thời gian</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Từ ngày"
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              fullWidth
              className="date-input-field"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Đến ngày"
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              inputProps={{ min: tempStartDate || undefined }}
              fullWidth
              className="date-input-field"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDateModal} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleApplyDateRange}
            variant="contained"
            disabled={!tempStartDate || !tempEndDate}
          >
            Áp dụng
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default Dashboard;
