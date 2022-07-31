import { css } from '@emotion/css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../Model';
import { Action } from '../../../Update';
import LogoButton from '../../commons/LogoButton';
import SearchField from '../../commons/SearchField';
import BadgeButton from './BadgeButton';
import LabelButton from './LabelButton';

const PCContent = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
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
          <SearchField state={state} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
};

export default PCContent;