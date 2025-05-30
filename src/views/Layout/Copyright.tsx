import { Box } from '@mui/material';
import { RootState } from 'main';
import { useSelector } from 'react-redux';

const Copyright = () => {
  const { loginUserUid } = useSelector((state: RootState) => state.authUser);

  if (!loginUserUid) return <></>;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 80,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            color: '#777',
            fontSize: 12,
            fontFamily: '"M PLUS Rounded 1c"',
            fontWeight: 300,
          }}
        >
          &copy; {new Date().getFullYear()} 原田日語小房
        </span>
      </div>
      <Box display={{ xs: 'block', sm: 'none' }}>
        <div style={{ height: 56 }} />
      </Box>
    </div>
  );
};

export default Copyright;
