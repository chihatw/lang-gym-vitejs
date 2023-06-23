import authUser from 'application/authUser/framework/1-middleware';
import users from 'application/users/framework/1-middleware';
import articles from 'application/articles/framework/1-middleware';
import audioBuffers from 'application/audioBuffers/framework/1-middleware';
import sentences from 'application/sentences/framework/1-middleware';
import quizzes from 'application/quizzes/framework/1-middleware';
import randomWorkouts from 'application/randomWorkouts/framework/1-middleware';

export default [
  ...authUser,
  ...users,
  ...articles,
  ...audioBuffers,
  ...sentences,
  ...quizzes,
  ...randomWorkouts,
];
