import { Navigate, useNavigate } from 'react-router-dom';
import React from 'react';
import { SentenceParsePage as SentenceParsePageComponent } from '@chihatw/lang-gym-h.page.sentence-parse-page';
import Cursor from '../../images/cursor.png';

import SentenceParsePageNewComponent from './components/SentenceParsePageNewComponent';
import { State } from '../../Model';
import { Action } from '../../Update';
import SkeletonPage from '../../components/SkeletonPage';

const SentenceParsePage = ({
  state,
  dispatch,
}: {
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const navigate = useNavigate();

  const { auth, articlePage, isFetching } = state;
  const { uid } = auth;
  const { article, sentences, sentenceParseProps, articleSentenceForms } =
    articlePage;

  if (!uid) return <Navigate to='/login' />;
  if (isFetching) return <SkeletonPage />;
  if (!isFetching && !article.id) return <Navigate to='/' />;

  if (!articleSentenceForms.length) {
    // 旧版
    return (
      <SentenceParsePageComponent
        Cursor={Cursor}
        id={article.id}
        title={article.title}
        marks={article.marks}
        embedID={article.embedID}
        createdAt={article.createdAt}
        sentences={sentences}
        sentenceParseProps={sentenceParseProps}
        handleBack={() => navigate(`/article/${article.id}`)}
      />
    );
  }
  // 新版
  return (
    <SentenceParsePageNewComponent
      title={article.title}
      marks={article.marks}
      embedID={article.embedID}
      createdAt={article.createdAt}
      sentences={sentences}
      handleBack={() => navigate(`/article/${article.id}`)}
      articleSentenceForms={articleSentenceForms}
    />
  );
};

export default SentenceParsePage;
