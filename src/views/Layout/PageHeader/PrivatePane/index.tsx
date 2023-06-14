import { Box } from '@mui/material';
import { RootState } from 'main';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppContext } from 'views';
import LabelButton from './LabelButton';
import { ActionTypes } from '../../../../Update';
import SelectUserPane from './SelectUserPane';
import HeaderQuizPane from './HeaderQuizPane';

function PrivatePane() {
  const { loginUser } = useSelector((state: RootState) => state.authUser);

  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const unansweredList = state.quizzes.filter(
    (item) => !Object.keys(item.scores).length
  );

  if (!loginUser) return <></>;

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
            handleClick={() => {
              dispatch({ type: ActionTypes.startFetching });
              navigate('/workout/list');
            }}
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
