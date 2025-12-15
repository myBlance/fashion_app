import englishMessages from 'ra-language-english';
import { TranslationMessages } from 'react-admin';

const vietnameseMessages: TranslationMessages = {
    ...englishMessages,
    ra: {
        ...englishMessages.ra,
        action: {
            ...englishMessages.ra.action,
            add_filter: 'Thêm bộ lọc',
            add: 'Thêm',
            back: 'Quay lại',
            bulk_actions: 'Đã chọn %{published_now} mục',
            cancel: 'Hủy',
            clear_input_value: 'Xóa giá trị',
            clone: 'Nhân bản',
            confirm: 'Xác nhận',
            create: 'Tạo mới',
            create_item: 'Tạo %{item}',
            delete: 'Xóa',
            edit: 'Sửa',
            export: 'Xuất',
            list: 'Danh sách',
            refresh: 'Làm mới',
            remove: 'Xóa',
            remove_filter: 'Bỏ bộ lọc',
            save: 'Lưu',
            search: 'Tìm kiếm',
            show: 'Chi tiết',
            sort: 'Sắp xếp',
            undo: 'Hoàn tác',
            unselect: 'Bỏ chọn',
            expand: 'Mở rộng',
            close: 'Đóng',
            open_menu: 'Mở menu',
            close_menu: 'Đóng menu',
            select_columns: 'Tùy chọn cột',
            update: 'Cập nhật',
            move_up: 'Di chuyển lên',
            move_down: 'Di chuyển xuống',
            open: 'Mở',
            toggle_theme: 'Đổi giao diện',
            select_all: 'Chọn tất cả',
            select_row: 'Chọn hàng',
            clear_array_input: 'Xóa danh sách',
        },

    },
    resources: {
        dashboard: {
            name: 'Bảng điều khiển', // Dashboard
            fields: {
                total_revenue: 'Tổng doanh thu',
                total_profit: 'Tổng lợi nhuận',
                total_orders: 'Tổng đơn hàng',
            }
        },
        orders: {
            name: 'Đơn hàng |||| Đơn hàng',
            fields: {
                id: 'Mã đơn',
                customerName: 'Khách hàng',
                totalPrice: 'Tổng tiền',
                status: 'Trạng thái',
                paymentMethod: 'Thanh toán',
                createdAt: 'Ngày tạo',
            },
        },
        products: {
            name: 'Sản phẩm |||| Sản phẩm',
            fields: {
                name: 'Tên sản phẩm',
                price: 'Giá',
                originalPrice: 'Giá gốc',
                stock: 'Kho',
                category: 'Danh mục',
                image: 'Hình ảnh',
                description: 'Mô tả',
            },
        },
        vouchers: {
            name: 'Mã giảm giá |||| Mã giảm giá',
            fields: {
                code: 'Mã',
                value: 'Giá trị',
                minOrderAmount: 'Đơn tối thiểu',
                maxUses: 'Tổng SL',
                usedCount: 'Đã dùng',
                validFrom: 'Bắt đầu',
                validUntil: 'Kết thúc',
                isActive: 'Hoạt động',
            },
        },
        reviews: {
            name: 'Đánh giá |||| Đánh giá',
            fields: {
                product: 'Sản phẩm',
                user: 'Người dùng',
                rating: 'Điểm',
                comment: 'Bình luận',
                createdAt: 'Ngày đánh giá',
                status: 'Trạng thái',
            },
        },
        users: {
            name: 'Người dùng |||| Người dùng',
            fields: {
                username: 'Tên đăng nhập',
                email: 'Email',
                role: 'Vai trò',
                phone: 'Số điện thoại',
                name: 'Họ tên',
            },
        },
    },
};

export default vietnameseMessages;
