import React from 'react';

const StyledMessage = ({ message }: { message: String }) => {
  return (
    <div
      style={{
        color: '#52a2aa',
        fontSize: 12,
        marginTop: 16,
        fontWeight: 400,
        paddingLeft: 16,
      }}
    >
      {message}
    </div>
  );
};

export default StyledMessage;
