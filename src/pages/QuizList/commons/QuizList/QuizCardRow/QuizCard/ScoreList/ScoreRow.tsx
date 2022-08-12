import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Button, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionTypes } from '../../../../../../../Update';
import { AppContext } from '../../../../../../../App';

dayjs.extend(relativeTime);
dayjs.locale('ja');

const ScoreRow = ({
  cardIndex,
  scoreIndex,
}: {
  cardIndex: number;
  scoreIndex: number;
}) => {
  const { state, dispatch } = useContext(AppContext);
  const { quizzes } = state;
  const { answeredList } = quizzes;
  const card = answeredList[cardIndex];
  const { scores, id: questionSetId } = card;
  const score = scores[scoreIndex];
  const theme = useTheme();
  const navigate = useNavigate();
  const { score: _score, id, createdAt, questionCount } = score;
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
        navigate(`/score/${id}/quiz/${questionSetId}`);
      }}
    >
      <span>
        {_score === questionCount
          ? '全問正解'
          : Math.round((_score / questionCount) * 100) + '%正解'}
      </span>
      <span className='center' />
      <span>{dayjs(createdAt).fromNow()}</span>
    </Button>
  );
};

export default ScoreRow;
