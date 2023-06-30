import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'main';

import HeaderQuizPane from './HeaderQuizPane';
import LabelButton from './LabelButton';
import SelectUserPane from './SelectUserPane';

function PrivatePane() {
  const { loginUserUid } = useSelector((state: RootState) => state.authUser);

  const navigate = useNavigate();

  if (!loginUserUid) return <></>;

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
