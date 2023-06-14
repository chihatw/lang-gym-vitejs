import { useNavigate } from 'react-router-dom';

import { Button, Container, useTheme } from '@mui/material';
import { useDispatch } from 'react-redux';
import { authUserActions } from 'application/authUser/framework/0-reducer';

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
        <StyledButton
          label='メールアドレス変更'
          handleClick={() => navigate('/account/mail')}
        />
        <StyledButton
          label='パスワード変更'
          handleClick={() => navigate('/account/password')}
        />
        <StyledButton
          label='サインアウト'
          handleClick={handleSignOut}
          isContained
        />
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
