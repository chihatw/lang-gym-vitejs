import {
  Button,
  CircularProgress,
  Container,
  TextField,
  useTheme,
} from '@mui/material';
import CancelButton from './commons/CancelButton';
import StyledMessage from './commons/StyledMessage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { changeEmailFormActions } from 'application/changeEmailForm/framework/0-reducer';
import { validateEmail } from 'application/signinForm/core/2-service';

const ChangeEmailPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    message,
    isLoading,
    emailErrMsg,
    passwordErrMsg,
    newEmailErrMsg,
    email,
    password,
    newEmail,
  } = useSelector((state: RootState) => state.changeEmailForm);

  const handleChangeEmail = async () => {
    console.log('!!');
    dispatch(changeEmailFormActions.updateEmailStart());
  };
  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />

      <div style={{ display: 'grid', rowGap: 32 }}>
        <TextField
          type='email'
          size='small'
          label={'現在のメールアドレス'}
          value={email}
          error={!!emailErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(changeEmailFormActions.changeEmail(e.target.value))
          }
          fullWidth
          helperText={emailErrMsg}
          autoComplete={'email'}
        />
        <TextField
          type='password'
          size='small'
          label={'パスワード'}
          value={password}
          error={!!passwordErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(changeEmailFormActions.changePassword(e.target.value))
          }
          fullWidth
          helperText={passwordErrMsg}
          autoComplete={'current-password'}
        />
        <TextField
          type={'email'}
          size='small'
          label={'新しいメールアドレス'}
          value={newEmail}
          error={!!newEmailErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(changeEmailFormActions.changeNewEmail(e.target.value))
          }
          fullWidth
          helperText={newEmailErrMsg}
          autoComplete={'email'}
        />
        <div>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </div>
          ) : (
            <Button
              type='submit'
              color='primary'
              variant='contained'
              fullWidth
              disabled={
                !email ||
                !password ||
                !newEmail ||
                !validateEmail(email) ||
                !validateEmail(newEmail) ||
                password.length < 6
              }
              onClick={handleChangeEmail}
            >
              <span
                style={{
                  ...(theme.typography as any).mPlusRounded,
                  color: 'white',
                }}
              >
                メールアドレス変更
              </span>
            </Button>
          )}
          <StyledMessage message={message} />
        </div>
        <CancelButton />
      </div>
    </Container>
  );
};

export default ChangeEmailPage;
