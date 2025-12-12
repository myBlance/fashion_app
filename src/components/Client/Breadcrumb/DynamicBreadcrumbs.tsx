import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

// 1. Tạo từ điển map các route sang tiếng Việt
const routeNameMap: Record<string, string> = {
    'shop': 'Sản phẩm',
    'product': 'Sản phẩm',
    'cart': 'Giỏ hàng',
    'wishlist': 'Yêu thích',
    'checkout': 'Thanh toán',
    'profile': 'Tài khoản',
    'orders': 'Đơn hàng',
    'login': 'Đăng nhập',
    'register': 'Đăng ký',
    'about': 'Giới thiệu',
    'contact': 'Liên hệ',
    'blog': 'Tin tức',
    'auth': 'Xác thực'
};

// 2. Hàm xử lý tên hiển thị
function getBreadcrumbName(str: string) {
    // Nếu có trong từ điển thì dùng tên tiếng Việt
    if (routeNameMap[str]) {
        return routeNameMap[str];
    }

    // Nếu chuỗi quá dài (thường là ID sản phẩm/đơn hàng), hiển thị gọn lại
    // MongoDB ID thường là 24 ký tự
    if (str.length > 20) {
        return 'Chi tiết';
    }

    // Mặc định: Viết hoa chữ cái đầu và bỏ dấu gạch ngang
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

export default function DynamicBreadcrumbs() {
    const location = useLocation();

    // Lấy state được truyền qua navigate (nếu có) để hiển thị tên sản phẩm thay vì ID
    // Ví dụ: navigate(`/product/${id}`, { state: { name: "Áo thun" } })
    const state = location.state as { name?: string } | null;

    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ my: 2, display: 'flex', alignItems: 'center' }}
        >
            <Link
                component={RouterLink}
                to="/"
                underline="hover"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Trang chủ
            </Link>

            {pathnames.map((value, index) => {
                let to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;

                // Redirect /product (case-insensitive) to /shop
                if (value.toLowerCase() === 'product') {
                    to = '/shop';
                }

                // Logic: Nếu là phần tử cuối cùng VÀ có state.name (tên sp) thì dùng state.name
                // Nếu không thì dùng logic getBreadcrumbName.
                // Pass lowercase value to lookup key in map
                let displayName = getBreadcrumbName(value.toLowerCase());

                // If lookup failed (returned original string capitalized), try looking up original value just in case,
                // otherwise keep what getBreadcrumbName returned (which handles the default formatting).
                // Actually getBreadcrumbName returns capitalized string if not found.
                // Let's rely on getBreadcrumbName doing the lookup on lowercased key.

                if (isLast && state?.name) {
                    displayName = state.name;
                }

                return isLast ? (
                    <Typography key={to} color="#b11116" fontWeight="bold">
                        {displayName}
                    </Typography>
                ) : (
                    <Link
                        component={RouterLink}
                        to={to}
                        key={to}
                        underline="hover"
                        color="inherit"
                    >
                        {displayName}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}