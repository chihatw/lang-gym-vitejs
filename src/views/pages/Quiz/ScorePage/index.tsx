import * as R from 'ramda';
import { Navigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import { Container } from '@mui/material';

import QuestionIndex from '../commons/QuestionIndex';

import SpeakerButton from '../commons/SpeakerButton';
import AccentsAnswer from './AccentsAnswer';
import QuizPageHeader from '../commons/QuizPageHeader';
import Score from './Score';
import RhythmsAnswer from './RhythmsAnswer';
import ScoreFooter from './ScoreFooter';
import { AppContext } from '../../..';
import { getBlob } from '../../../../application/services/quiz';
import { INITIAL_QUIZ, State } from '../../../../Model';
import { ActionTypes } from '../../../../Update';
import AudioSlider from '../../../components/AudioSlider';

const ScorePage = () => {
  const { quizId, scoreId } = useParams();
  const { state, dispatch } = useContext(AppContext);
  const [quiz, setQuiz] = useState(INITIAL_QUIZ);
  const [blob, setBlob] = useState<Blob | null>(null);

  /** quiz の代入 */
  useEffect(() => {
    const quiz = state.quizzes.find((item) => item.id === quizId);
    if (!quiz) return;
    setQuiz(quiz);
  }, [state.quizzes, quizId]);

  useEffect(() => {
    const blob = state.blobs[quiz.downloadURL];
    if (!blob) return;
    setBlob(blob);
  }, [state.blobs, quiz.downloadURL]);

  // state.blobs の更新
  useEffect(() => {
    if (!quiz.downloadURL) return;

    // ローカルにあれば、終了
    if (!!state.blobs[quiz.downloadURL]) return;

    const fetchData = async () => {
      const blob = await getBlob(quiz.downloadURL);
      if (!blob) return;
      const updatedState = R.assocPath<Blob, State>(
        ['blobs', quiz.downloadURL],
        blob
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [quiz, state.blobs]);

  if (!quizId || !scoreId) return <></>;

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ paddingTop: 16, paddingBottom: 80 }}>
        <div style={{ display: 'grid', rowGap: 24 }}>
          <QuizPageHeader title={quiz.title} createdAt={quiz.createdAt} />
          <Score state={state} />
          <div style={{ display: 'grid', rowGap: 24 }}>
            {Object.values(quiz.questions).map((question, questionIndex) => (
              <div key={questionIndex} style={{ display: 'grid', rowGap: 8 }}>
                <QuestionIndex index={questionIndex + 1} />
                {quiz.type === 'articleAccents' && (
                  <>
                    {!!blob && (
                      <AudioSlider
                        end={question.end}
                        start={question.start}
                        blob={blob}
                        spacer={5}
                      />
                    )}
                    <div style={{ display: 'grid', rowGap: 8 }}>
                      <AccentsAnswer
                        quiz={quiz}
                        scoreId={scoreId}
                        questionIndex={questionIndex}
                      />
                    </div>
                  </>
                )}
                {quiz.type === 'articleRhythms' && (
                  <div>
                    {!!state.blobs[quiz.downloadURL] && (
                      <SpeakerButton
                        start={question.start}
                        end={question.end}
                        quizBlob={state.blobs[quiz.downloadURL]}
                      />
                    )}

                    <RhythmsAnswer
                      scoreId={scoreId}
                      quiz={quiz}
                      questionIndex={questionIndex}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 80 }} />
        <ScoreFooter />
      </div>
    </Container>
  );
};

export default ScorePage;
