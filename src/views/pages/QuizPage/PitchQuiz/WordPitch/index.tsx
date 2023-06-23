import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'main';

import MoraPitch from './MoraPitch';
import { buildWordPitches } from 'application/utils/buildWordPitches';
import { selectWordDisabled } from 'application/quizPage/framework/2-selector';

const WordPitch = ({
  wordIndex,
  questionId,
  wordPitchStr,
}: {
  wordIndex: number;
  questionId: string;
  wordPitchStr: string;
}) => {
  const wordPitches = useMemo(
    () => buildWordPitches(wordPitchStr),
    [wordPitchStr]
  );

  const wordDisabled = useSelector((state: RootState) =>
    selectWordDisabled(state, { questionId, wordIndex })
  );

  const moraPitches = wordPitches.map((mora, moraIndex) => {
    const next = wordPitches[moraIndex + 1];
    return (
      <MoraPitch
        key={moraIndex}
        mora={mora}
        isLast={moraIndex === wordPitches.length - 1}
        disabled={wordDisabled}
        isAccent={!!next && next.length === 1 && mora.length === 2}
        wordIndex={wordIndex}
        moraIndex={moraIndex}
        questionId={questionId}
      />
    );
  });

  if (!wordPitches.length) return <></>;
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          paddingTop: 8,
          marginBottom: 16,
          borderRadius: 4,
          backgroundColor: wordDisabled ? '#eee' : 'transparent',
        }}
      >
        {moraPitches}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default React.memo(WordPitch);
