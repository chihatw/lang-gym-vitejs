import LabelIcon from '@mui/icons-material/Label';
import { IconButton } from '@mui/material';
import { useDispatch } from 'react-redux';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';

import MoraSeparater from './MoraSeparater';
import { quizPageActions } from 'application/quizPage/framework/0-reducer';

const TouchIcon = ({
  isAccent,
  disabled,
  wordIndex,
  moraIndex,
  questionId,
}: {
  isAccent: boolean;
  disabled: boolean;
  wordIndex: number;
  moraIndex: number;
  questionId: string;
}) => {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(
      quizPageActions.setInputPitchStr({
        questionId,
        wordIndex,
        moraIndex,
      })
    );
  };

  return (
    <div style={{ left: 16, position: 'relative' }}>
      <IconButton size='small' disabled={disabled} onClick={handleClick}>
        {isAccent ? (
          <LabelIcon
            style={{
              color: '#f50057',
              position: 'relative',
              transform: 'rotate(270deg)',
            }}
          />
        ) : (
          <LabelOutlinedIcon
            style={{
              color: '#86bec4',
              position: 'relative',
              transform: 'rotate(270deg)',
            }}
          />
        )}
      </IconButton>
      <MoraSeparater isAccent={isAccent} />
    </div>
  );
};

export default TouchIcon;
