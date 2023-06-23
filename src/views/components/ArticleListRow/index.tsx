import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, useTheme } from '@mui/material';

import { RootState } from 'main';

const ArticleListRow = ({ articleId }: { articleId: string }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { title, year, day, month } = useSelector((state: RootState) => {
    const article = state.articles.entities[articleId];
    if (!article) {
      return { title: '', year: 0, month: 0, day: 0 };
    }
    const date = new Date(article.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return { title: article.title, year, month, day };
  });

  if (!title) return <></>;

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
          <div style={{ fontSize: 14 }}>{title}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleListRow;
