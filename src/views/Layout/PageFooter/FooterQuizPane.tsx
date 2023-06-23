import { css } from '@emotion/css';
import { useSelector } from 'react-redux';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Badge } from '@mui/material';

import { RootState } from 'main';

function FooterQuizPane() {
  const { unansweredIds } = useSelector((state: RootState) => state.quizList);

  return (
    <Badge
      className={css({
        '.MuiBadge-badge': {
          color: 'white',
          background: '#f50057',
        },
      })}
      badgeContent={unansweredIds.length}
    >
      <AssignmentIcon />
    </Badge>
  );
}

export default FooterQuizPane;
