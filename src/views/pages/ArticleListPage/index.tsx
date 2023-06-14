import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, useTheme } from '@mui/material';

import { RootState } from 'main';

import CustomLabel from '../../components/CustomLabel';

import ArticleListRow from 'views/components/ArticleListRow';
import { articleListActions } from 'application/articleList/framework/0-reducer';

const ArticleListPage = () => {
  const dispatch = useDispatch();

  const theme = useTheme();

  const { articleIds, initializing, hasMore } = useSelector(
    (state: RootState) => state.articleList
  );

  useEffect(() => {
    if (!initializing) return;
    dispatch(articleListActions.initiate());
  }, [initializing]);

  const showMore = async () => {
    dispatch(articleListActions.getMoreArticles());
  };

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ height: 48 }} className='dummyHeader' />
      <div style={{ display: 'grid', rowGap: 8 }}>
        <CustomLabel label='作文一覧' />
        {articleIds.map((articleId, index) => (
          <ArticleListRow key={index} articleId={articleId} />
        ))}
        {!!hasMore && (
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={showMore}
              sx={{
                ...(theme.typography as any).mPlusRounded300,
                color: '#52a2aa',
                fontSize: 12,
              }}
            >
              もっと表示
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ArticleListPage;
