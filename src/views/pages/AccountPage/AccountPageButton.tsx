import { Button, useTheme } from '@mui/material';

const AccountPageButton = ({
  label,
  handleClick,
  isContained,
}: {
  handleClick: () => void;
  label: string;
  isContained?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={isContained ? 'contained' : 'outlined'}
      color='primary'
      onClick={handleClick}
    >
      <span
        style={{
          ...(theme.typography as any).mPlusRounded500,
          color: isContained ? 'white' : '#52a2aa',
        }}
      >
        {label}
      </span>
    </Button>
  );
};

export default AccountPageButton;
