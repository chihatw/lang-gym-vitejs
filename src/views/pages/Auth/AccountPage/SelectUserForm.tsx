import { useContext, useState } from 'react';
import {
  Select,
  MenuItem,
  useTheme,
  InputLabel,
  FormControl,
} from '@mui/material';
import { INITIAL_STATE, State } from '../../../../Model';
import { AUTH_LOCAL_STORAGE } from '../../../../constants';
import { ActionTypes } from '../../../../Update';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../..';

const SelectUserForm = () => {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const { auth } = state;
  const { uid, users } = auth;

  const [selectedUid, setSelectedUid] = useState(uid);

  const handleSelectUid = (selectedUid: string) => {
    if (!dispatch) return;
    setSelectedUid(selectedUid);
    localStorage.setItem(AUTH_LOCAL_STORAGE, selectedUid);

    const updatedState: State = {
      ...INITIAL_STATE,
      auth: { ...auth, uid: selectedUid, initializing: true },
    };
    dispatch({ type: ActionTypes.setState, payload: updatedState });
    navigate('/');
  };

  return (
    <FormControl fullWidth>
      <InputLabel>user</InputLabel>
      <Select
        style={{ ...(theme.typography as any).mPlusRounded }}
        value={selectedUid}
        variant='standard'
        onChange={(e) => handleSelectUid(e.target.value)}
      >
        {users.map((user, index) => (
          <MenuItem
            key={index}
            value={user.id}
            style={{ ...(theme.typography as any).mPlusRounded }}
          >
            {user.displayname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectUserForm;
