import { AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LogoButton from '../commons/LogoButton';
import PrivatePane from './PrivatePane';

const PageHeader = () => {
  const navigate = useNavigate();
  return (
    <AppBar
      elevation={0}
      sx={{
        backgroundColor: '#52a2aa',
        backgroundImage:
          'repeating-linear-gradient(135deg,transparent,transparent 10px,rgba(86, 171, 179, 1) 10px,rgba(86, 171, 179, 1) 20px)',
      }}
    >
      <Toolbar variant='dense' sx={{ display: 'grid' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <LogoButton handleClick={() => navigate('/')} />
          <PrivatePane />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default PageHeader;
