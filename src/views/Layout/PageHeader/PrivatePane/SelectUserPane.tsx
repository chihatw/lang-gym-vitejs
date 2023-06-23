import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MenuItem, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'main';

import { userListActions } from 'application/userList/framework/0-reducer';
import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';
import { selectAllUsers } from 'application/users/framework/0-reducer';

function SelectUserPane() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUser } = useSelector((state: RootState) => state.authUser);
  const { initializing, selectedUid } = useSelector(
    (state: RootState) => state.userList
  );
  const users = useSelector((state: RootState) => selectAllUsers(state));

  // userIds の取得
  useEffect(() => {
    if (!loginUser.uid) return;
    if (!initializing) return;

    // currentUid は localStorage から受け取る
    const currentUid =
      localStorage.getItem(CURRENT_UID_LOCAL_STORAGE_KEY) || loginUser.uid;

    dispatch(userListActions.initiate(currentUid));
  }, [initializing, loginUser]);

  if (loginUser.uid !== import.meta.env.VITE_ADMIN_UID) return <></>;
  return (
    <Select
      sx={{ color: 'white' }}
      value={selectedUid}
      variant='standard'
      onChange={(e) => {
        navigate('/');
        dispatch(userListActions.setSelectedUid(e.target.value));
        localStorage.setItem(CURRENT_UID_LOCAL_STORAGE_KEY, e.target.value);
      }}
      disableUnderline
    >
      {users.map((user, index) => {
        return (
          <MenuItem value={user.uid} key={index}>
            <div>{user.displayName}</div>
          </MenuItem>
        );
      })}
    </Select>
  );
}

export default SelectUserPane;
