import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { auth } from './repositories/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const App = () => {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log(user);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      hello
      <Button
        onClick={() => {
          signInWithEmailAndPassword(auth, '', '')
            .then(() => console.log('done'))
            .catch((e) => console.log(e));
        }}
      >
        sign in
      </Button>
    </div>
  );
};

export default App;
