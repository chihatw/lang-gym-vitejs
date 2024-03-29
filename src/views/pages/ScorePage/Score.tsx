import { css, keyframes } from '@emotion/css';
import { useTheme } from '@mui/material';

import { useSelector } from 'react-redux';
import { RootState } from 'main';
import {
  selectQuiz,
  selectScore,
} from 'application/scorePage/framework/2-selector';

const barberAnimation = keyframes`
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position: 0px -209px;
  }
`;

const Score = () => {
  const theme = useTheme();
  const quiz = useSelector((state: RootState) => selectQuiz(state));
  const score = useSelector((state: RootState) => selectScore(state));

  if (!quiz || !score) return <></>;

  const ratio = Math.round((score.score / quiz.questionCount) * 100);

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
        {`${ratio}%`}
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
