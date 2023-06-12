import { useTheme } from '@mui/material';
import { RootState } from 'main';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CreatedAt = () => {
  const { articleId } = useParams();
  const theme = useTheme();
  const articles = useSelector((state: RootState) => state.articles);

  const { year, month, day } = useMemo(() => {
    const article = articles[articleId!];
    const date = new Date(article!.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { article, year, month, day };
  }, [articleId, articles]);

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
