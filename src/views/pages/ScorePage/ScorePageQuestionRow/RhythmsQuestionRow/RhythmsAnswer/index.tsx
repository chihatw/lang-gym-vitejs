import CorrectAnswer from '../../../commons/CorrectAnswer';
import CorrectRhythms from './CorrectRhythms';
import IncorrectRhythms from './IncorrectRhythms';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectSyllablesArray } from 'application/quizQuestions/framework/2-selector';
import { selectAnsweredSpecialMoraArray } from 'application/scorePage/framework/2-selector';

const RhythmsAnswer = ({
  index,
  questionId,
}: {
  index: number;
  questionId: string;
}) => {
  const syllablesArray = useSelector((state: RootState) =>
    selectSyllablesArray(state, questionId)
  );
  const answeredSpecialMoraArray = useSelector((state: RootState) =>
    selectAnsweredSpecialMoraArray(state, index)
  );

  if (
    JSON.stringify(answeredSpecialMoraArray) ===
    JSON.stringify(
      syllablesArray.map((syllableUnit) =>
        syllableUnit.map((syllable) => syllable.specialMora)
      )
    )
  ) {
    return (
      <CorrectAnswer>
        <CorrectRhythms questionId={questionId} />
      </CorrectAnswer>
    );
  }
  return <IncorrectRhythms index={index} questionId={questionId} />;
};

export default RhythmsAnswer;
