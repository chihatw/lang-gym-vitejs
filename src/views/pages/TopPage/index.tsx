import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, useTheme } from '@mui/material';

import { RootState } from 'main';

import { topPageActions } from 'application/topPage/framework/0-reducer';
import CustomLabel from 'views/components/CustomLabel';
import ArticleListRow from '../../components/ArticleListRow';

function TopPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { articleIds, initializing, hasMore } = useSelector(
    (state: RootState) => state.topPage
  );

  useEffect(() => {
    // 初期化が終わっていれば、終了
    if (!initializing) return;
    dispatch(topPageActions.initiate());
  }, [initializing]);

  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ height: 48 }} className='dummyHeader' />
      <div style={{ display: 'grid', rowGap: 8 }}>
        <CustomLabel label='最近の作文' />
        {articleIds.map((articleId, index) => (
          <ArticleListRow key={index} articleId={articleId} />
        ))}
        {hasMore && (
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => navigate('/article/list')}
              sx={{
                ...(theme.typography as any).mPlusRounded300,
                color: '#52a2aa',
                fontSize: 12,
              }}
            >
              一覧表示
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default TopPage;
