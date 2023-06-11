import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '../../../../../../../../Update';
import { AppContext } from '../../../../../../../../App';
import { QuizScore } from '../../../../../../../../Model';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const ScoreRow = ({ score, quizId }: { score: QuizScore; quizId: string }) => {
  const { state, dispatch } = useContext(AppContext);
  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Button
      fullWidth
      color='primary'
      sx={{
        ...(theme.typography as any).mPlusRounded300,
        color: '#52a2aa',
        display: 'grid',
        fontSize: 12,
        gridTemplateColumns: 'auto 1fr auto',
      }}
      onClick={(e) => {
        if (!dispatch) return;
        e.stopPropagation();
        dispatch({ type: ActionTypes.startFetching });
        navigate(`/quiz/${quizId}/score/${score.createdAt}`);
      }}
    >
      <span>
        {score.score === quiz.questionCount
          ? '全問正解'
          : Math.round((score.score / quiz.questionCount) * 100) + '%正解'}
      </span>
      <span className='center' />
      <span>{dayjs(score.createdAt).fromNow()}</span>
    </Button>
  );
};

export default ScoreRow;
