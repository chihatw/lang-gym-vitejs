import { Button, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../Model';
import {
  answeredQuestionSet,
  buildNewScore,
  calcPitchesQuiz,
  calcRhythmQuiz,
  pitchesArray2Accents,
  setNewScore,
  updateQuizzes,
} from '../../../services/quiz';
import { Action, ActionTypes } from '../../../Update';

const QuizPageFooter = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { quiz, auth, quizzes } = state;
  const { uid } = auth;
  const { id, type, questions, questionCount } = quiz;

  const handleSubmit = async () => {
    if (!['articleAccents', 'articleRhythms'].includes(type)) return;

    const points =
      type === 'articleAccents'
        ? calcPitchesQuiz(questions)
        : calcRhythmQuiz(questions);

    const inputs: { [questionId: string]: string } = {};
    questions.forEach((question) => {
      const { id, inputPitchesArray, inputSpecialMoraArray } = question;
      const accents = pitchesArray2Accents(inputPitchesArray);
      inputs[id] = JSON.stringify(
        type === 'articleAccents' ? accents : inputSpecialMoraArray
      );
    });
    const score = buildNewScore(uid, points, inputs, id);
    // スコアの永続化
    let successed = await setNewScore(score);
    if (!successed) return;

    // 問題セットのリモート更新
    successed = await answeredQuestionSet(id);
    if (!successed) return;

    const updatedQuizzes = updateQuizzes(quiz, score, quizzes, questionCount);

    dispatch({
      type: ActionTypes.submitQuiz,
      payload: { score, quizzes: updatedQuizzes },
    });
    navigate(`/score/${score.id}/quiz/${id}`);

    return;
  };

  return (
    <div style={{ display: 'grid', rowGap: 16 }}>
      <Button
        fullWidth
        variant='contained'
        onClick={handleSubmit}
        sx={{ backgroundColor: '#52a2aa' }}
      >
        <ButtonLabel label='送信' color='white' />
      </Button>
      <Button
        sx={{ backgroundColor: '#e0e0e0' }}
        fullWidth
        variant='contained'
        onClick={() => navigate('/quizzes')}
      >
        <ButtonLabel label='戻る' color='#777' />
      </Button>
    </div>
  );
};

export default QuizPageFooter;

const ButtonLabel = ({ label, color }: { label: string; color: string }) => {
  const theme = useTheme();
  return (
    <span
      style={{
        ...(theme.typography as any).mPlusRounded500,
        color,
        fontSize: 14,
      }}
    >
      {label}
    </span>
  );
};
