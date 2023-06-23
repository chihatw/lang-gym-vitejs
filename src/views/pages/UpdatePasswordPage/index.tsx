import { FormEvent, useEffect, useState } from 'react';

import {
  Button,
  CircularProgress,
  Container,
  TextField,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { updatePasswordFormActions } from 'application/updatePasswordForm/framework/0-reducer';
import { validateEmail } from 'application/signinForm/core/2-service';

const UpdatePasswordPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    email,
    password,
    newPassword,
    isLoading,
    message,
    emailErrMsg,
    passwordErrMsg,
    newPasswordErrMsg,
  } = useSelector((state: RootState) => state.updatePasswordForm);

  const handleUpdatePassword = async () => {
    dispatch(updatePasswordFormActions.updatePasswordStart());
  };

  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />

      <div style={{ display: 'grid', rowGap: 32 }}>
        <TextField
          type='email'
          size='small'
          label='メールアドレス'
          value={email}
          error={!!emailErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(updatePasswordFormActions.changeEmail(e.target.value))
          }
          fullWidth
          helperText={emailErrMsg}
          autoComplete='email'
        />
        <TextField
          type='password'
          size='small'
          label='現在のパスワード'
          value={password}
          error={!!passwordErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(updatePasswordFormActions.changePassword(e.target.value))
          }
          fullWidth
          helperText={passwordErrMsg}
          autoComplete={'current-password'}
        />
        <TextField
          type='password'
          size='small'
          label='新しいパスワード(6字以上)'
          value={newPassword}
          error={!!newPasswordErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            dispatch(
              updatePasswordFormActions.changeNewPassword(e.target.value)
            )
          }
          fullWidth
          helperText={newPasswordErrMsg}
          autoComplete={'current-password'}
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
                !newPassword ||
                !validateEmail(email) ||
                password.length < 6 ||
                newPassword.length < 6
              }
              onClick={handleUpdatePassword}
            >
              <span
                style={{
                  ...(theme.typography as any).mPlusRounded,
                  color: 'white',
                }}
              >
                パスワード変更
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
        </div>
        <Button
          variant='contained'
          fullWidth
          disableElevation
          style={{
            ...(theme.typography as any).mPlusRounded,
          }}
          onClick={() => navigate('/account')}
          sx={{
            backgroundColor: '#e0e0e0',
            ':hover': { background: '#ccc' },
          }}
        >
          戻る
        </Button>
      </div>
    </Container>
  );
};

export default UpdatePasswordPage;
