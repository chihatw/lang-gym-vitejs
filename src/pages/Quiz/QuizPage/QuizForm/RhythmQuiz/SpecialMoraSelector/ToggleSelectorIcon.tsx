import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import { IconButton } from '@mui/material';
import React from 'react';

const ToggleSelectorIcon = ({ handleToggle }: { handleToggle: () => void }) => {
  return (
    <div
      style={{
        position: 'relative',
        left: 16,
      }}
    >
      <IconButton size='small' onClick={handleToggle}>
        <LabelOutlinedIcon
          style={{
            color: '#86bec4',
            position: 'relative',
            transform: 'rotate(270deg)',
          }}
        />
      </IconButton>
      <div
        style={{
          top: -15,
          left: 14,
          height: 21,
          position: 'absolute',
          borderLeft: `2px dotted #86bec4`,
        }}
      />
    </div>
  );
};

export default ToggleSelectorIcon;
