import { useTheme } from '@mui/material';
import ScoreRow from './ScoreRow';

const ScoreList = ({
  scoreIds,
  quizId,
}: {
  scoreIds: string[];
  quizId: string;
}) => {
  const theme = useTheme();

  if (!scoreIds.length) return <></>;
  return (
    <div>
      <div
        style={{
          ...(theme.typography as any).mPlusRounded300,
          color: '#777',
          fontSize: 12,
          userSelect: 'none',
        }}
      >
        結果
      </div>
      {scoreIds.map((scoreId, index) => (
        <ScoreRow key={index} scoreId={scoreId} quizId={quizId} />
      ))}
    </div>
  );
};

export default ScoreList;
