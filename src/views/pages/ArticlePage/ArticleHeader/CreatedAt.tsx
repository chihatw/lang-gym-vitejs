import { useTheme } from '@mui/material';
import { selectCreateAt } from 'application/articlePage/framework/2-selector';
import { RootState } from 'main';
import { useSelector } from 'react-redux';

const CreatedAt = () => {
  const theme = useTheme();
  const { year, month, day } = useSelector((state: RootState) =>
    selectCreateAt(state)
  );

  return (
    <div
      style={{
        ...(theme.typography as any).mPlusRounded300,
        color: '#777',
        fontSize: 12,
      }}
    >
      {`${year}年${month}月${day}日`}
    </div>
  );
};

export default CreatedAt;
