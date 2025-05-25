import { MenuItem, Select } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'main';

import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';
import { userListActions } from 'application/userList/framework/0-reducer';
import { selectAllUsers } from 'application/users/framework/0-reducer';

function SelectUserPane() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUserUid } = useSelector((state: RootState) => state.authUser);
  const { initializing, selectedUid } = useSelector(
    (state: RootState) => state.userList
  );
  const users = useSelector((state: RootState) => selectAllUsers(state));

  // userIds の取得
  useEffect(() => {
    if (!loginUserUid) return;
    if (!initializing) return;

    // currentUid は localStorage から受け取る
    const currentUid =
      localStorage.getItem(CURRENT_UID_LOCAL_STORAGE_KEY) || loginUserUid;

    dispatch(userListActions.initiate(currentUid));
  }, [initializing, loginUserUid]);

  if (loginUserUid !== import.meta.env.VITE_ADMIN_UID) return <></>;
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
          <MenuItem value={user.id} key={index}>
            <div>{user.displayName}</div>
          </MenuItem>
        );
      })}
    </Select>
  );
}

export default SelectUserPane;
