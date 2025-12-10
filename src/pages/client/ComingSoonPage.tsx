import React from 'react';
import '../../styles/ComingSoonPage.css';

const ComingSoonPage: React.FC = () => {
  return (
    <div className="coming-soon-container">
      <img
        src="/assets/images/comingsoon.png"
        alt="Under Construction"
        className="coming-soon-image"
      />
      <h1 className="coming-soon-title">Tính năng đang được phát triển</h1>
      <p className="coming-soon-text">
        Trang này sẽ sớm được cập nhật. Vui lòng quay lại sau!
      </p>
      <a
        href="/"
        className="coming-soon-link"
      >
        Quay lại trang chủ
      </a>
    </div>
  );
};

export default ComingSoonPage;
