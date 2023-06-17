import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { css } from '@emotion/css';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import FooterQuizPane from './FooterQuizPane';

const PageFooter = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { loginUser } = useSelector((state: RootState) => state.authUser);

  const [value, setValue] = useState(-1);

  useEffect(() => {
    let navItemIndex: number;
    switch (pathname) {
      case '/':
        navItemIndex = 0;
        break;
      case '/workout/list':
        navItemIndex = 1;
        break;
      case '/quiz/list/unanswered':
        navItemIndex = 2;
        break;
      case '/account':
        navItemIndex = 3;
        break;
      default:
        navItemIndex = -1;
    }
    setValue(navItemIndex);
  }, [pathname]);

  const handleClick = (event: any, value: number) => {
    setValue(value);
    let path = '';
    switch (value) {
      case 0: {
        path = '/';
        break;
      }
      case 1: {
        path = '/workout/list';
        break;
      }
      case 2: {
        path = '/quiz/list/unanswered';
        break;
      }
      case 3: {
        path = '/account';
        break;
      }
      default: {
      }
    }
    path && navigate(path);
  };

  if (!loginUser.uid) return <></>;

  return (
    <BottomNavigation
      value={value}
      className={css({
        '&.MuiBottomNavigation-root': {
          backgroundColor: '#52a2aa',
          backgroundImage:
            'repeating-linear-gradient(135deg,transparent,transparent 10px,rgba(86, 171, 179, 1) 10px,rgba(86, 171, 179, 1) 20px)',
        },
        '.MuiBottomNavigationAction-root.Mui-selected': {
          color: 'white',
        },
        '.MuiBottomNavigationAction-label': {
          fontFamily: '"M PLUS Rounded 1c"',
          fontWeight: 300,
        },
      })}
      showLabels={true}
      onChange={handleClick}
    >
      <BottomNavigationAction label='ホーム' icon={<ImportContactsIcon />} />
      <BottomNavigationAction label='練習' icon={<AccessTimeIcon />} />
      <BottomNavigationAction label='小テスト' icon={<FooterQuizPane />} />
      <BottomNavigationAction label='個人資料' icon={<AccountCircleIcon />} />
    </BottomNavigation>
  );
};

export default PageFooter;
