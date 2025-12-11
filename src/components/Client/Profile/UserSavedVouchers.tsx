import React, { useEffect, useState } from 'react';
import { UserVoucher, UserVoucherListResponse, VoucherService } from '../../../services/voucherService'; // Điều chỉnh đường dẫn nếu cần
import '../../../styles/UserSavedVouchers.css'; // Điều chỉnh đường dẫn nếu cần

// Giả định bạn có context hoặc cách khác để lấy token người dùng
// Ở đây mình dùng localStorage làm ví dụ tạm thời
const getToken = () => localStorage.getItem('token'); // Hoặc từ context

const UserSavedVouchers: React.FC = () => {
  const [userVouchers, setUserVouchers] = useState<UserVoucher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [claimCode, setClaimCode] = useState('');
  const [claimMessage, setClaimMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchSavedVouchers = async () => {
      const token = getToken();
      if (!token) {
        setError('Người dùng chưa đăng nhập.');
        setLoading(false);
        return;
      }

      try {
        // ✅ Sử dụng service đã xây dựng
        const response: UserVoucherListResponse = await VoucherService.getMyVouchers(token);

        if (response.success && Array.isArray(response.data)) {
          // ✅ Backend đã trả về đúng cấu trúc { success: true,  [...] }
          setUserVouchers(response.data);
        } else {
          console.error('Cấu trúc dữ liệu không hợp lệ từ API saved vouchers:', response);
          setError('Dữ liệu voucher không hợp lệ.');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải voucher đã lưu:', err);
        let errorMessage = 'Không thể tải danh sách voucher đã lưu.';
        if (err.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Không tìm thấy endpoint lấy voucher đã lưu. Vui lòng kiểm tra lại server.';
        } else if (err.response?.status === 500) {
          errorMessage = 'Lỗi máy chủ khi lấy voucher đã lưu. Vui lòng thử lại sau.';
        }
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedVouchers();
  }, []);

  const handleClaimVoucher = async () => {
    if (!claimCode.trim()) return;

    const token = getToken();
    if (!token) {
      setClaimMessage({ type: 'error', text: 'Vui lòng đăng nhập để lưu voucher.' });
      return;
    }

    try {
      const res = await VoucherService.claimVoucher(claimCode, token);
      if (res.success) {
        setClaimMessage({ type: 'success', text: 'Lưu voucher thành công!' });
        setClaimCode('');
        // Reload danh sách
        const listRes = await VoucherService.getMyVouchers(token);
        if (listRes.success) setUserVouchers(listRes.data);
      }
    } catch (err: any) {
      setClaimMessage({
        type: 'error',
        text: err.response?.data?.message || 'Không thể lưu voucher. Vui lòng kiểm tra lại mã.'
      });
    }
  };

  const handleUseVoucher = (code: string) => {
    // Ví dụ: Sao chép mã voucher vào clipboard
    navigator.clipboard.writeText(code)
      .then(() => {
        alert(`Mã voucher ${code} đã được sao chép!`);
      })
      .catch(err => {
        console.error('Lỗi khi sao chép voucher:', err);
        alert('Không thể sao chép mã voucher.');
      });
  };

  if (loading) {
    return <div className="user-saved-vouchers-container"><p>Đang tải voucher đã lưu...</p></div>;
  }

  if (error) {
    return <div className="user-saved-vouchers-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="user-saved-vouchers-container">
      <h2>Voucher Đã Lưu</h2>

      {/* ✅ Khu vực nhập mã voucher */}
      <div className="claim-voucher-section">
        <input
          type="text"
          className="claim-input"
          placeholder="Nhập mã voucher"
          value={claimCode}
          onChange={(e) => setClaimCode(e.target.value)}
        />
        <button
          className="claim-btn"
          onClick={handleClaimVoucher}
          disabled={!claimCode.trim()}
        >
          Lưu
        </button>
      </div>
      {claimMessage && (
        <p className={`claim-message ${claimMessage.type}`}>
          {claimMessage.text}
        </p>
      )}

      {userVouchers.length === 0 ? (
        <p>Bạn chưa có voucher nào.</p>
      ) : (
        <div className="vouchers-grid">
          {userVouchers.map((uv) => {
            const voucher = uv.voucher;
            const isExpired = new Date(voucher.expiryDate) < new Date();
            const isUsed = uv.isUsed;

            return (
              <div
                key={uv.id} // ✅ Dùng uv.id thay vì voucher._id
                className={`voucher-card ${isExpired || isUsed ? 'voucher-disabled' : ''}`}
              >
                <div className="voucher-header">
                  <span className="voucher-code">{voucher.code}</span>
                  <span className={`voucher-status ${voucher.isFreeShip ? 'free-ship' : 'discount'}`}>
                    {voucher.isFreeShip ? 'FREESHIP' : voucher.discountText}
                  </span>
                </div>
                <div className="voucher-body">
                  <p className="voucher-condition">{voucher.conditionText}</p>
                  <p className="voucher-shop">Cửa hàng: {voucher.shopName}</p>
                  <p className="voucher-expiry">
                    HSD: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="voucher-usage">
                    Đã dùng: {isUsed ? '1' : '0'}/1 {/* Giả định maxUsesPerUser = 1 */}
                  </p>
                  {isExpired && <p className="voucher-status-badge expired">Đã hết hạn</p>}
                  {isUsed && <p className="voucher-status-badge used">Đã sử dụng</p>}
                </div>
                <div className="voucher-footer">
                  <button
                    className="use-voucher-btn"
                    onClick={() => handleUseVoucher(voucher.code)}
                    disabled={isExpired || isUsed}
                  >
                    {isExpired ? 'Hết hạn' : isUsed ? 'Đã dùng' : 'Sao chép'}
                  </button>
                  {/* Không có nút "Bỏ lưu" vì voucher đã được gắn vào tài khoản */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserSavedVouchers;