import { Button, useTheme } from '@mui/material';
import React from 'react';

const StyledButton = ({
  label,
  color,
  disabled,
  handleClick,
}: {
  label: string;
  color: string;
  disabled?: boolean;
  handleClick?: () => void;
}) => {
  const theme = useTheme();
  return (
    <Button
      style={{
        ...(theme.typography as any).mPlusRounded300,
        color,
      }}
      onClick={handleClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default StyledButton;
