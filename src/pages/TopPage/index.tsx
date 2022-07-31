import { Navigate, useNavigate } from 'react-router-dom';
import React from 'react';

import { Container } from '@mui/material';
import { Action, ActionTypes } from '../../Update';
import ArticleCardList from '../../components/ArticleCardList';
import { State } from '../../Model';

const TopPage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();
  const { auth, topPage } = state;
  const { uid } = auth;
  const { cards, hasMore } = topPage;

  const handleClick = async (articleId: string) => {
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${articleId}`);
  };

  const handleShowList = async () => {
    dispatch({ type: ActionTypes.startFetching });
    navigate('/articles');
  };

  if (!uid) return <Navigate to='/login' />;
  return (
    <>
      <div style={{ height: 48 }} className='dummyHeader' />
      <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
        <ArticleCardList
          cards={cards}
          label='最近の作文'
          handleShowList={hasMore ? handleShowList : undefined}
          showListButtonLabel='一覧表示'
          handleClick={handleClick}
        />
      </Container>
    </>
  );
};

export default TopPage;
