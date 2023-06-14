import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'main';

import BadgeButton from './BadgeButton';
import { quizListActions } from 'application/quizList/framework/0-reducer';

function HeaderQuizPane() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { initializing, unansweredIds } = useSelector(
    (state: RootState) => state.quizList
  );

  useEffect(() => {
    if (!initializing) return;
    dispatch(quizListActions.initiate());
  }, [initializing]);

  return (
    <BadgeButton
      label='小テスト'
      handleClick={() => navigate('/quiz/list/unanswered')}
      badgeContent={unansweredIds.length}
    />
  );
}

export default HeaderQuizPane;
