import { Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';

import { ArticleCardsState } from '../../Model';
import { ActionTypes } from '../../Update';
import { Container } from '@mui/material';
import ArticleCardList from '../../components/ArticleCardList';
import { getArticleCards } from '../../services/article';
import { AppContext } from '../../App';

const ArticlesPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const { auth, articlesPage, isFetching } = state;
  const { uid } = auth;
  const { cards, hasMore, startAfter } = articlesPage;

  useEffect(() => {
    if (!isFetching || !dispatch) return;
    const fetchData = async () => {
      const articleCards = !!cards.length
        ? articlesPage
        : await getArticleCards(uid, 10);
      dispatch({
        type: ActionTypes.setArticleList,
        payload: articleCards,
      });
    };
    fetchData();
  }, [isFetching, cards, uid, articlesPage, dispatch]);

  const handleClick = async (articleId: string) => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${articleId}`);
  };

  const showMore = async () => {
    if (!dispatch) return;
    const result = await getArticleCards(uid, 10, startAfter);
    const updated: ArticleCardsState = {
      ...result,
      cards: cards.concat(result.cards),
    };
    dispatch({ type: ActionTypes.setMoreArticles, payload: updated });
  };

  if (!uid) return <Navigate to='/login' />;
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ height: 48 }} className='dummyHeader' />
      <ArticleCardList
        cards={cards}
        label='作文一覧'
        handleShowList={hasMore ? showMore : undefined}
        showListButtonLabel='もっと表示'
        handleClick={handleClick}
      />
    </Container>
  );
};

export default ArticlesPage;
