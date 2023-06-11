import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, useTheme } from '@mui/material';

import { RootState } from 'main';

function ArticleListRow({ articleId }: { articleId: string }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const articles = useSelector((state: RootState) => state.articles);

  const { year, month, day, article } = useMemo(() => {
    const article = articles[articleId];

    const date = new Date(article.createdAt);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { article, year, month, day };
  }, [articles, articleId]);

  if (!article) return <></>;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={() => navigate(`/article/${articleId}`)}
      elevation={0}
    >
      <CardContent>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded300,
            userSelect: 'none',
          }}
        >
          <div
            style={{ color: '#777', fontSize: 10 }}
          >{`${year}年${month}月${day}日`}</div>
          <div style={{ fontSize: 14 }}>{article.title}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ArticleListRow;
