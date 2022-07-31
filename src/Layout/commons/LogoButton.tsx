import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { Button, useTheme } from '@mui/material';
import React from 'react';

const LogoButton: React.FC<{ handleClick?: () => void }> = ({
  handleClick,
}) => {
  const theme = useTheme();
  return (
    <Button onClick={handleClick} sx={{ color: 'white', fontSize: 18 }}>
      <div
        style={{
          display: 'grid',
          columnGap: 12,
          gridTemplateColumns: 'auto auto',
        }}
      >
        <div style={{ paddingTop: 1 }}>
          <ImportContactsIcon />
        </div>
        <span
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: 'white',
            whiteSpace: 'nowrap',
          }}
        >
          原田日語小房
        </span>
      </div>
    </Button>
  );
};

export default LogoButton;
