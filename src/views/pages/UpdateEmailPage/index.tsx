import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  useTheme,
  Container,
  TextField,
  CircularProgress,
} from '@mui/material';

import { RootState } from 'main';
import { validateEmail } from 'application/signinForm/core/2-service';
import { updateEmailFormActions } from 'application/updateEmailForm/framework/0-reducer';

const UpdateEmailPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    email,
    password,
    newEmail,
    isLoading,
    message,
    emailErrMsg,
    passwordErrMsg,
    newEmailErrMsg,
  } = useSelector((state: RootState) => state.updateEmailForm);

  const handleUpdateEmail = async () => {
    dispatch(updateEmailFormActions.updateEmailStart());
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
            dispatch(updateEmailFormActions.changeEmail(e.target.value))
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
            dispatch(updateEmailFormActions.changePassword(e.target.value))
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
            dispatch(updateEmailFormActions.changeNewEmail(e.target.value))
          }
          fullWidth
          helperText={newEmailErrMsg}
          autoComplete={'email'}
        />

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
            onClick={handleUpdateEmail}
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
        <div
          style={{
            color: '#52a2aa',
            fontSize: 12,
            marginTop: 16,
            fontWeight: 400,
            paddingLeft: 16,
          }}
        >
          {message}
        </div>

        <Button
          variant='contained'
          fullWidth
          disableElevation
          style={{
            ...(theme.typography as any).mPlusRounded,
          }}
          onClick={() => navigate('/account')}
          sx={{ backgroundColor: '#e0e0e0', ':hover': { background: '#ccc' } }}
        >
          戻る
        </Button>
      </div>
    </Container>
  );
};

export default UpdateEmailPage;
