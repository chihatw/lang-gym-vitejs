import { Button, useTheme } from '@mui/material';

const LabelButton = ({
  label,
  handleClick,
}: {
  label: string;
  handleClick?: () => void;
}) => {
  const theme = useTheme();
  return (
    <Button onClick={handleClick} sx={{ color: 'white' }}>
      <span
        style={{
          ...(theme.typography as any).mPlusRounded,
          color: 'white',
          fontSize: 14,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </Button>
  );
};

export default LabelButton;
