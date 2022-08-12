import { css } from '@emotion/css';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import LogoButton from '../../commons/LogoButton';
import SearchField from '../../commons/SearchField';
import BadgeButton from './BadgeButton';
import LabelButton from './LabelButton';

const PCContent = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { quizzes } = state;
  const { unansweredList } = quizzes;
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
        <div
          className={css({
            width: '100%',
            display: 'flex',
            transition: 'width 0.3s',
            alignItems: 'center',
            '@media (min-width: 600px)': {
              width: 240,
            },
            '@media (min-width: 680px)': {
              width: 320,
            },
          })}
        >
          <SearchField />
        </div>
      </div>
    </div>
  );
};

export default PCContent;
