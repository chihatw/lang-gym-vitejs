import authUser from 'application/authUser/framework/1-middleware';
import users from 'application/users/framework/1-middleware';

export default [...authUser, ...users];
