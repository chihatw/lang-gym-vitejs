import { Navigate, useLocation } from 'react-router-dom';
import { Container } from '@mui/material';
import React, { useContext } from 'react';

import { AppContext } from '../../../App';
import ArticleCardList from '../../../components/ArticleCardList';

const ArticleListPage = () => {
  const { pathname } = useLocation();
  const { state } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;

  if (!uid) return <Navigate to='/login' />;
  return (
    <Container maxWidth='sm' sx={{ paddingTop: 2 }}>
      <div style={{ height: 48 }} className='dummyHeader' />
      <ArticleCardList isTopPage={pathname === '/'} />
    </Container>
  );
};

export default ArticleListPage;
