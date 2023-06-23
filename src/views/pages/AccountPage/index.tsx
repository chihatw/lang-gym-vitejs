import { useNavigate } from 'react-router-dom';

import { Button, Container, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authUserActions } from 'application/authUser/framework/0-reducer';
import AccountPageButton from './AccountPageButton';

const AccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(authUserActions.signoutInitiate());
  };

  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />
      <div style={{ display: 'grid', rowGap: 32 }}>
        <AccountPageButton
          label='メールアドレス変更'
          handleClick={() => navigate('/account/mail')}
        />
        <AccountPageButton
          label='パスワード変更'
          handleClick={() => navigate('/account/password')}
        />
        <AccountPageButton
          label='サインアウト'
          handleClick={handleSignOut}
          isContained
        />
      </div>
    </Container>
  );
};

export default AccountPage;
