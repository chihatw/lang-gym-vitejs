import { Navigate } from 'react-router-dom';
import React, { FormEvent, useContext, useEffect, useState } from 'react';

import { Container, TextField } from '@mui/material';
import { handleUpdateEmail } from '../../../services/auth';
import CancelButton from '../commons/CancelButton';
import StyledMessage from '../commons/StyledMessage';
import SubmitButton from '../commons/SubmitButton';
import { AppContext } from '../../../App';

const MailPage = () => {
  const { state } = useContext(AppContext);
  const { auth } = state;
  const { uid } = auth;

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailErrMsg, setEmailErrMsg] = useState('');
  const [passwordErrMsg, setPasswordErrMsg] = useState('');
  const [newEmailErrMsg, setNewEmailErrMsg] = useState('');

  useEffect(() => {
    setEmailErrMsg('');
    setPasswordErrMsg('');
    setNewEmailErrMsg('');
  }, [email, password, newEmail]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('処理中です...');
    const { success, message, emailErrMsg, passwordErrMsg, newEmailErrMsg } =
      await handleUpdateEmail(email, password, newEmail);
    setMessage(message);
    setEmailErrMsg(emailErrMsg);
    setPasswordErrMsg(passwordErrMsg);
    setNewEmailErrMsg(newEmailErrMsg);
    if (success) {
      setEmail(newEmail);
      setPassword('');
      setNewEmail('');
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
              label={'現在のメールアドレス'}
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
              label={'パスワード'}
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
              type={'email'}
              size='small'
              label={'新しいメールアドレス'}
              value={newEmail}
              error={!!newEmailErrMsg}
              variant='outlined'
              required
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
              helperText={newEmailErrMsg}
              autoComplete={'email'}
            />
            <div>
              <SubmitButton label='メールアドレス変更' />
              <StyledMessage message={message} />
            </div>
            <CancelButton />
          </div>
        </form>
      </div>
    </Container>
  );
};

export default MailPage;
