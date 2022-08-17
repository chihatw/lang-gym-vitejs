import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { ActionTypes } from '../../../Update';
import LogoButton from '../../commons/LogoButton';
import BadgeButton from './BadgeButton';
import LabelButton from './LabelButton';

const PCContent = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { quizList } = state;
  const { unansweredList } = quizList;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <LogoButton handleClick={() => navigate('/')} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto auto auto 1fr',
        }}
      >
        <LabelButton
          handleClick={() => {
            if (!dispatch) return;
            dispatch({ type: ActionTypes.startFetching });
            navigate('/workout/list');
          }}
          label='練習'
        />
        <BadgeButton
          label='小テスト'
          handleClick={() => navigate('/quizzes')}
          badgeContent={unansweredList.length}
        />
        <LabelButton
          handleClick={() => navigate('/account')}
          label='個人資料'
        />
      </div>
    </div>
  );
};

export default PCContent;
