import { Hidden } from '@mui/material';
import { RootState } from 'main';
import { useSelector } from 'react-redux';

const Copyright = () => {
  const { loginUser } = useSelector((state: RootState) => state.authUser);

  if (!loginUser) return <></>;
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
      <Hidden smUp>
        <div style={{ height: 56 }} />
      </Hidden>
    </div>
  );
};

export default Copyright;
