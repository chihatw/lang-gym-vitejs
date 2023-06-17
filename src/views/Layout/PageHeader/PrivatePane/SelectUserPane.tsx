import { MenuItem, Select } from '@mui/material';
import { CURRENT_UID_LOCAL_STORAGE_KEY } from 'application/authUser/core/1-constants';
import { userListActions } from 'application/userList/framework/0-reducer';
import { RootState } from 'main';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SelectUserPane() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginUser } = useSelector((state: RootState) => state.authUser);
  const { initializing, uids, selectedUid } = useSelector(
    (state: RootState) => state.userList
  );
  const users = useSelector((state: RootState) => state.users);

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
      {uids.map((uid, index) => (
        <MenuItem value={uid} key={index}>
          <div>{users[uid]}</div>
        </MenuItem>
      ))}
    </Select>
  );
}

export default SelectUserPane;
