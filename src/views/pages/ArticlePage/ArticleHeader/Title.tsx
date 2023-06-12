import { useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'main';

const Title = () => {
  const theme = useTheme();
  const { articleId } = useParams();
  const articles = useSelector((state: RootState) => state.articles);

  const article = useMemo(() => articles[articleId!], [articleId, articles]);

  if (!article) return <></>;
  return (
    <div
      style={{
        ...(theme.typography as any).notoSerifJP,
        fontSize: 24,
      }}
    >
      {article.title}
    </div>
  );
};

export default Title;
