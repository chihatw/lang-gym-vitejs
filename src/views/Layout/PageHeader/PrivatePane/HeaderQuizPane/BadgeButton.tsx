import { css } from '@emotion/css';
import { Badge, Button, useTheme } from '@mui/material';
import * as React from 'react';

const BadgeButton: React.FC<{
  label: string;
  handleClick?: () => void;
  badgeContent?: number;
}> = ({ label, handleClick, badgeContent }) => {
  const theme = useTheme();
  return (
    <Button onClick={handleClick} sx={{ color: 'white' }}>
      <Badge
        badgeContent={badgeContent}
        className={css({
          '.MuiBadge-badge': {
            color: 'white',
            background: '#f50057',
          },
        })}
      >
        <span
          style={{
            ...(theme.typography as any).mPlusRounded,
            color: 'white',
            fontSize: 14,
          }}
        >
          {label}
        </span>
      </Badge>
    </Button>
  );
};

export default BadgeButton;
