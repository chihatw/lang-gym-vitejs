import { Navigate, useNavigate } from 'react-router-dom';
import React, { useContext } from 'react';

import { Container } from '@mui/material';
import { ActionTypes } from '../../Update';
import ArticleCardList from '../../components/ArticleCardList';
import { AppContext } from '../../App';

const TopPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const { auth, topPage } = state;
  const { uid } = auth;
  const { cards, hasMore } = topPage;

  const handleClick = async (articleId: string) => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${articleId}`);
  };

  const handleShowList = async () => {
    if (!dispatch) return;
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
