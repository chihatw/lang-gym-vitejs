import * as R from 'ramda';
import { Navigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';

import { Container } from '@mui/material';

import QuestionIndex from '../commons/QuestionIndex';

import SpeakerButton from '../commons/SpeakerButton';
import AccentsAnswer from './AccentsAnswer';
import QuizPageHeader from '../commons/QuizPageHeader';
import Score from './Score';
import RhythmsAnswer from './RhythmsAnswer';
import ScoreFooter from './ScoreFooter';
import { AppContext } from '../../../App';
import { getBlob } from '../../../services/quiz';
import { State } from '../../../Model';
import { ActionTypes } from '../../../Update';

const ScorePage = () => {
  const { quizId, scoreId } = useParams();
  if (!quizId || !scoreId) return <></>;
  const { state, dispatch } = useContext(AppContext);

  if (!state.auth.uid) return <Navigate to='/login' />;

  const quiz = state.quizzes.find((item) => item.id === quizId);
  if (!quiz) return <></>;

  useEffect(() => {
    if (!state.isFetching || !dispatch) return;

    const fetchData = async () => {
      let _blob: Blob | null = null;
      if (quiz.downloadURL) {
        _blob =
          state.blobs[quiz.downloadURL] || (await getBlob(quiz.downloadURL));
      }

      const updatedBlobs = { ...state.blobs };
      if (_blob) {
        updatedBlobs[quiz.downloadURL] = _blob;
      }
      const updatedState = R.compose(
        R.assocPath<boolean, State>(['isFetching'], false),
        R.assocPath<{ [downloadURL: string]: Blob }, State>(
          ['blobs'],
          updatedBlobs
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });
    };
    fetchData();
  }, [quiz, state.blobs]);
  if (state.isFetching) return <></>;
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
                  <AccentsAnswer
                    quiz={quiz}
                    scoreId={scoreId}
                    questionIndex={questionIndex}
                  />
                )}
                {quiz.type === 'articleRhythms' && (
                  <div>
                    {!!state.blobs[quiz.downloadURL] &&
                      !!state.audioContext && (
                        <SpeakerButton
                          start={question.start}
                          end={question.end}
                          quizBlob={state.blobs[quiz.downloadURL]}
                          audioContext={state.audioContext}
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
