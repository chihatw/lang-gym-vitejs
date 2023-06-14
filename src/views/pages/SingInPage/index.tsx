import { useEffect, useState } from 'react';

import {
  Button,
  CircularProgress,
  Container,
  TextField,
  useTheme,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'main';
import { signinFormActions } from 'application/signinForm/framework/0-reducer';
import { validateEmail } from 'application/signinForm/core/2-service';

const SignInPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { isLoading, emailErrMsg, passwordErrMsg } = useSelector(
    (state: RootState) => state.signInForm
  );
  const [state, setState] = useState({ email: '', password: '' });

  useEffect(() => {
    if (!!emailErrMsg || !passwordErrMsg) {
      dispatch(signinFormActions.resetError());
    }
  }, [state]);

  const handleSignIn = () => {
    dispatch(
      signinFormActions.signinInitiate({
        email: state.email,
        password: state.password,
      })
    );
  };

  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />

      <div style={{ display: 'grid', rowGap: 24 }}>
        <TextField
          type='email'
          size='small'
          label='email'
          value={state.email}
          error={!!emailErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            setState((currentState) => ({
              ...currentState,
              email: e.target.value,
            }))
          }
          fullWidth
          helperText={emailErrMsg}
          autoComplete='email'
        />
        <TextField
          type='password'
          size='small'
          label='password'
          value={state.password}
          error={!!passwordErrMsg}
          variant='outlined'
          required
          onChange={(e) =>
            setState((currentState) => ({
              ...currentState,
              password: e.target.value,
            }))
          }
          fullWidth
          helperText={passwordErrMsg}
          autoComplete='current-password'
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
              !state.email ||
              !state.password ||
              !validateEmail(state.email) ||
              state.password.length < 6
            }
            onClick={handleSignIn}
          >
            <span
              style={{
                ...(theme.typography as any).mPlusRounded,
                color: 'white',
                fontSize: 14,
                whiteSpace: 'nowrap',
              }}
            >
              サインイン
            </span>
          </Button>
        )}
      </div>
    </Container>
  );
};

export default SignInPage;
