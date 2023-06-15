import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import { useMemo } from 'react';

import { RootState } from 'main';

import WordPitch from './WordPitch';

import AudioBufferSlider from 'views/components/AudioBufferSlider';
import SentencePitchLine from 'views/components/SentencePitchLine';

const PitchQuiz = ({ questionId }: { questionId: string }) => {
  const theme = useTheme();

  const { quizId, inputPitchStrs } = useSelector(
    (state: RootState) => state.quizPage
  );
  const quizzes = useSelector((state: RootState) => state.quizzes);
  const quizQuestions = useSelector((state: RootState) => state.quizQuestions);
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const quiz = useMemo(() => quizzes[quizId], [quizId, quizzes]);
  const question = useMemo(
    () => quizQuestions[questionId] || null,
    [questionId, quizQuestions]
  );
  const audioBuffer = useMemo(() => {
    if (!quiz) return null;
    return fetchedAudioBuffers[quiz.downloadURL] || null;
  }, [quiz, fetchedAudioBuffers]);

  const inputPitchStr = useMemo(
    () => inputPitchStrs[questionId],
    [questionId, inputPitchStrs]
  );

  if (!question || !inputPitchStr) return <></>;

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      {!!audioBuffer && (
        <AudioBufferSlider
          end={question.end}
          start={question.start}
          audioBuffer={audioBuffer}
        />
      )}
      <div
        style={{
          ...(theme.typography as any).notoSerifJP,
          fontSize: 14,
        }}
      >
        {question.japanese}
      </div>
      <SentencePitchLine pitchStr={inputPitchStr} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {inputPitchStr.split(' ').map((_, wordIndex) => (
          <WordPitch
            key={wordIndex}
            wordIndex={wordIndex}
            questionId={questionId}
          />
        ))}
      </div>
    </div>
  );
};

export default PitchQuiz;
