import { useParams } from 'react-router-dom';
import BackButton from './BackButton';
import CreatedAt from './CreatedAt';
import Title from './Title';

const QuizPageHeader = ({
  title,
  createdAt,
}: {
  title: string;
  createdAt: number;
}) => {
  const { scoreId } = useParams();
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <Title title={title} />
      <CreatedAt createdAt={createdAt} />
      {!!scoreId && <BackButton />}
    </div>
  );
};

export default QuizPageHeader;
