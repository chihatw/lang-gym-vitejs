import { css, keyframes } from '@emotion/css';
import { useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';
import { State } from '../../../Model';

const barberAnimation = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 0px -209px;
  }
`;

const Score = ({ state }: { state: State }) => {
  const { scoreId, quizId } = useParams();
  if (!scoreId || !quizId) return <></>;

  const { scores: scoresState, quizzes } = state;
  const quiz = quizzes[quizId];
  const scoreState = scoresState[scoreId];
  const { questionCount } = quiz;

  const { score: points } = scoreState;

  const theme = useTheme();

  const ratio = Math.round((points / questionCount) * 100);
  const score = `${ratio}%`;

  const comment = (() => {
    if (ratio < 100 && ratio >= 75) {
      return 'もう少しです！';
    } else if (ratio < 75) {
      return 'がんばって！';
    } else {
      return '素晴らしいです！';
    }
  })();

  return (
    <div
      className={css`
        background: linear-gradient(
          135deg,
          rgba(82, 162, 170, 1) 12.5%,
          rgba(86, 171, 179, 1) 12.5%,
          rgba(86, 171, 179, 1) 37.5%,
          rgba(82, 162, 170, 1) 37.5%,
          rgba(82, 162, 170, 1) 62.5%,
          rgba(86, 171, 179, 1) 62.5%,
          rgba(86, 171, 179, 1) 87.5%,
          rgba(82, 162, 170, 1) 87.5%
        );
        background-size: 30px 30px;
        animation: ${barberAnimation} 4000ms linear infinite;
        border-radius: 8px;
        padding: 40px 0;
      `}
    >
      <div
        style={{
          ...(theme.typography as any).lato900,
          color: 'white',
          fontSize: 80,
          textAlign: 'center',
        }}
      >
        {score}
      </div>
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          color: 'white',
          fontSize: 24,
          textAlign: 'center',
        }}
      >
        {comment}
      </div>
    </div>
  );
};

export default Score;
