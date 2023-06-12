import authUser from 'application/authUser/framework/1-middleware';
import users from 'application/users/framework/1-middleware';
import articles from 'application/articles/framework/1-middleware';
import topPage from 'application/topPage/framework/1-middleware';
import articleList from 'application/articleList/framework/1-middleware';
import audio from 'application/audio/framework/1-middleware';
import sentences from 'application/sentences/framework/1-middleware';

export default [
  ...authUser,
  ...users,
  ...articles,
  ...topPage,
  ...articleList,
  ...audio,
  ...sentences,
];
