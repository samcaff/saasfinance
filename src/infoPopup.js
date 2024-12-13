import React from 'react';

const InfoPopup = ({ title, content, position }) => {
  const { top, left } = position || { top: '50%', left: '50%' };

  return (
    <div
      style={{
        position: 'absolute', // Changed to absolute for relative positioning
        top: top,
        left: left,
        transform: 'translate(2%, -98%)',
        backgroundColor: '#0f0e1f',
        color: '#f1f1f1',
        padding: '10px',
        borderRadius: '8px',
        zIndex: 1000,
        width: '250px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <h4 style={{ margin: 0 }}>{title}</h4>
      <p style={{ fontSize: '12px', marginTop: '5px' }}>{content}</p>
    </div>
  );
};

export default InfoPopup;
