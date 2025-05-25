import { IconButton, useTheme } from '@mui/material';

const Monitor = ({ specialMora }: { specialMora: string }) => {
  const theme = useTheme();
  return (
    <div style={{ margin: '-5px -8px 34px 0' }}>
      <div>
        <IconButton
          sx={{ ':hover': { backgroundColor: '#fee0eb' } }}
          size='small'
          disabled
          style={{
            width: specialMora.length === 2 ? 44 : 28,
            position: 'relative',
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <span
            style={{
              ...(theme.typography as any).mPlusRounded,
              color: '#f50057',
              fontSize: 12,
              letterSpacing: 0,
            }}
          >
            {specialMora}
          </span>
        </IconButton>
      </div>
    </div>
  );
};

export default Monitor;
