import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import { ArticleCardsState, State } from '../../Model';
import { Action, ActionTypes } from '../../Update';
import { Container } from '@mui/material';
import ArticleCardList from '../../components/ArticleCardList';
import { getArticleCards } from '../../services/article';

const ArticlesPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();

  const { auth, articlesPage, isFetching } = state;
  const { uid } = auth;
  const { cards, hasMore, startAfter } = articlesPage;

  useEffect(() => {
    if (!isFetching) return;
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
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${articleId}`);
  };

  const showMore = async () => {
    const result = await getArticleCards(uid, 10, startAfter);
    const updated: ArticleCardsState = {
      ...result,
      cards: cards.concat(result.cards),
    };
    dispatch({ type: ActionTypes.setMoreArticles, payload: updated });
  };

  if (!!uid) {
    return (
      <>
        <div style={{ height: 48 }} className='dummyHeader' />
        <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
          <ArticleCardList
            cards={cards}
            label='作文一覧'
            handleShowList={hasMore ? showMore : undefined}
            showListButtonLabel='もっと表示'
            handleClick={handleClick}
          />
        </Container>
      </>
    );
  } else {
    return <Navigate to='/login' />;
  }
};

export default ArticlesPage;
