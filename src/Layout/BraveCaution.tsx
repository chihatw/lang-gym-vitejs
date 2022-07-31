import React from 'react';

const BraveCaution = () => {
  return (
    <div
      style={{
        top: 52,
        left: 0,
        color: '#52a2aa',
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        textAlign: 'center',
        fontSize: 12,
        fontFamily: '"M PLUS Rounded 1c"',
      }}
    >
      <span>Braveでは表示が乱れる可能性があります。</span>
      <span style={{ paddingRight: 4 }}>
        <a
          href='https://www.google.com/chrome/'
          style={{ color: '#52a2aa', fontWeight: 500 }}
        >
          Chrome
        </a>
      </span>
      <span>推奨。</span>
    </div>
  );
};

export default BraveCaution;
