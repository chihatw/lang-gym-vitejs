import { memo } from 'react';
import Kana from './Kana';
import Sokuon from './Sokuon';
import TouchIcon from './TouchIcon';

const MoraPitch = ({
  mora,
  isLast,
  disabled,
  isAccent,
  wordIndex,
  moraIndex,
  questionId,
}: {
  wordIndex: number;
  moraIndex: number;
  questionId: string;
  isLast: boolean;
  mora: string[];
  disabled: boolean;
  isAccent: boolean;
}) => {
  const kana = mora[0];
  const isSokuon = ['っ', 'ッ'].includes(kana);
  return (
    <div>
      <Kana kana={kana} />
      {!isLast &&
        (isSokuon ? (
          <Sokuon />
        ) : (
          <TouchIcon
            isAccent={isAccent}
            disabled={disabled}
            wordIndex={wordIndex}
            moraIndex={moraIndex}
            questionId={questionId}
          />
        ))}
    </div>
  );
};

export default memo(MoraPitch);
