import { css } from '@emotion/css';
import React, { useState } from 'react';
import { Button, Container, TextField, useTheme } from '@mui/material';

export function SignInPageComponent({
  onSignIn,
  emailErrMsg,
  resetErrMsg,
  passwordErrMsg,
}: {
  emailErrMsg: string;
  passwordErrMsg: string;
  onSignIn: (email: string, password: string) => Promise<void>;
  resetErrMsg: () => void;
}) {
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSignIn(email, password);
          }}
        >
          <div className={css({ display: 'grid', rowGap: 24 })}>
            <TextField
              type='email'
              size='small'
              label='email'
              value={email}
              error={!!emailErrMsg}
              variant='outlined'
              required
              onChange={(e) => {
                resetErrMsg();
                setEmail(e.target.value);
              }}
              fullWidth
              helperText={emailErrMsg}
              autoComplete='email'
            />
            <TextField
              type='password'
              size='small'
              label='password'
              value={password}
              error={!!passwordErrMsg}
              variant='outlined'
              required
              onChange={(e) => {
                resetErrMsg();
                setPassword(e.target.value);
              }}
              fullWidth
              helperText={passwordErrMsg}
              autoComplete='current-password'
            />
            <Button type='submit' color='primary' variant='contained' fullWidth>
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
          </div>
        </form>
      </div>
    </Container>
  );
}
