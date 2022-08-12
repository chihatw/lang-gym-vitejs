import { Navigate, useNavigate } from 'react-router-dom';

import { signOut } from '../../../services/auth';
import { Action, ActionTypes } from '../../../Update';
import { Button, Container, useTheme } from '@mui/material';
import SelectUserForm from './SelectUserForm';
import { State } from '../../../Model';
import { useContext } from 'react';
import { AppContext } from '../../../App';

const VERSION = '1.2.6';

const AccountPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const { auth } = state;
  const { uid, users } = auth;
  const navigate = useNavigate();

  const handleSignOut = () => {
    if (!dispatch) return;
    signOut();
    dispatch({ type: ActionTypes.signOut });
  };

  if (!uid) return <Navigate to='/login' />;

  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />
      <div>
        {!!users.length && (
          <div style={{ margin: '16px 0' }}>
            <SelectUserForm />
          </div>
        )}
        <div style={{ display: 'grid', rowGap: 32 }}>
          <StyledButton
            label='メールアドレス変更'
            handleClick={() => navigate('mail')}
          />
          <StyledButton
            label='パスワード変更'
            handleClick={() => navigate('password')}
          />
          <StyledButton
            label='サインアウト'
            handleClick={handleSignOut}
            isContained
          />
        </div>
        <div style={{ height: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 10, color: '#777' }}>{`ver ${VERSION}`}</div>
        </div>
      </div>
    </Container>
  );
};

export default AccountPage;

const StyledButton = ({
  label,
  handleClick,
  isContained,
}: {
  handleClick: () => void;
  label: string;
  isContained?: boolean;
}) => {
  const theme = useTheme();

  return (
    <Button
      variant={isContained ? 'contained' : 'outlined'}
      color='primary'
      onClick={handleClick}
    >
      <span
        style={{
          ...(theme.typography as any).mPlusRounded500,
          color: isContained ? 'white' : '#52a2aa',
        }}
      >
        {label}
      </span>
    </Button>
  );
};
