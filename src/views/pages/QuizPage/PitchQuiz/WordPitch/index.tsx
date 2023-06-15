import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import string2PitchesArray from 'string2pitches-array';

import { RootState } from 'main';

import MoraPitch from './MoraPitch';

const WordPitch = ({
  questionId,
  wordIndex,
}: {
  questionId: string;
  wordIndex: number;
}) => {
  const { inputPitchStrs } = useSelector((state: RootState) => state.quizPage);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);

  const wordPitches = useMemo(() => {
    const inputPitchStr = inputPitchStrs[questionId];
    const wordPitchStr = inputPitchStr
      ? inputPitchStr.split(' ')[wordIndex]
      : '';
    return wordPitchStr ? string2PitchesArray(wordPitchStr)[0] : [];
  }, [inputPitchStrs, wordIndex, questionId]);

  const disabled = useMemo(() => {
    const question = quizQuestions[questionId];
    return question ? question.disableds.includes(wordIndex) : true;
  }, [quizQuestions, questionId, wordIndex]);

  if (!wordPitches.length) return <></>;
  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          display: 'flex',
          paddingTop: 8,
          marginBottom: 16,
          borderRadius: 4,
          backgroundColor: disabled ? '#eee' : 'transparent',
        }}
      >
        {wordPitches.map((mora, moraIndex) => {
          const next = wordPitches[moraIndex + 1];
          return (
            <MoraPitch
              key={moraIndex}
              mora={mora}
              isLast={moraIndex === wordPitches.length - 1}
              disabled={disabled}
              isAccent={!!next && next.length === 1 && mora.length === 2}
              wordIndex={wordIndex}
              moraIndex={moraIndex}
              questionId={questionId}
            />
          );
        })}
      </div>
      <div style={{ width: 8 }} />
    </div>
  );
};

export default WordPitch;
