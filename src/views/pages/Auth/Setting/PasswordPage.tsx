import { Navigate } from 'react-router-dom';
import React, { FormEvent, useContext, useEffect, useState } from 'react';

import { Container, TextField } from '@mui/material';
import { handleUpdatePassword } from '../../../../application/services/auth';
import CancelButton from '../commons/CancelButton';
import StyledMessage from '../commons/StyledMessage';
import SubmitButton from '../commons/SubmitButton';
import { AppContext } from '../../..';

const PasswordPage = () => {
  const { state } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [newPasswordErrMsg, setNewPasswordErrMsg] = useState('');

  useEffect(() => {
    setEmailErrMsg('');
    setPasswordErrMsg('');
    setNewPasswordErrMsg('');
  }, [email, password, newPassword]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('処理中です...');
    const { success, message, emailErrMsg, passwordErrMsg, newPasswordErrMsg } =
      await handleUpdatePassword(email, password, newPassword);
    setMessage(message);
    setEmailErrMsg(emailErrMsg);
    setPasswordErrMsg(passwordErrMsg);
    setNewPasswordErrMsg(newPasswordErrMsg);
    if (success) {
      setPassword('');
      setNewPassword('');
    }
  };

  if (!uid) return <Navigate to='/login' />;

  return (
    <Container maxWidth='xs'>
      <div style={{ height: 48 }} />
      <div style={{ height: 120 }} />
      <div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', rowGap: 32 }}>
            <TextField
              type={'email'}
              size='small'
              label={'メールアドレス'}
              value={email}
              error={!!emailErrMsg}
              variant='outlined'
              required
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              helperText={emailErrMsg}
              autoComplete={'email'}
            />
            <TextField
              type={'password'}
              size='small'
              label={'現在のパスワード'}
              value={password}
              error={!!passwordErrMsg}
              variant='outlined'
              required
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              helperText={passwordErrMsg}
              autoComplete={'current-password'}
            />
            <TextField
              type={'password'}
              size='small'
              label={'新しいパスワード(6字以上)'}
              value={newPassword}
              error={!!newPasswordErrMsg}
              variant='outlined'
              required
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              helperText={newPasswordErrMsg}
              autoComplete={'current-password'}
            />

            <div>
              <SubmitButton label='パスワード変更' />
              <StyledMessage message={message} />
            </div>
            <CancelButton />
          </div>
        </form>
      </div>
    </Container>
  );
};

export default PasswordPage;
