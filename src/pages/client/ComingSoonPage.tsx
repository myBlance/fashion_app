import React from 'react';

const ComingSoonPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '40px 20px',
        color: '#333',
      }}
    >
      <img
        src="/assets/images/comingsoon.png" 
        alt="Under Construction"
        style={{ width: '300px', marginBottom: '20px' }}
      />
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Tính năng đang được phát triển</h1>
      <p style={{ fontSize: '18px', color: '#666' }}>
        Trang này sẽ sớm được cập nhật. Vui lòng quay lại sau!
      </p>
      <a
        href="/"
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#000',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
        }}
      >
        Quay lại trang chủ
      </a>
    </div>
  );
};

export default ComingSoonPage;
