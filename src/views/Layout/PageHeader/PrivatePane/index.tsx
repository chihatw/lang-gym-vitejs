import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

import { RootState } from 'main';

import LabelButton from './LabelButton';
import SelectUserPane from './SelectUserPane';
import HeaderQuizPane from './HeaderQuizPane';

function PrivatePane() {
  const { loginUser } = useSelector((state: RootState) => state.authUser);

  const navigate = useNavigate();

  if (!loginUser.uid) return <></>;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SelectUserPane />
          <LabelButton
            handleClick={() => navigate('/workout/list')}
            label='練習'
          />
          <HeaderQuizPane />
          <LabelButton
            handleClick={() => navigate('/account')}
            label='個人資料'
          />
        </div>
      </Box>
    </div>
  );
}

export default PrivatePane;
