import { Collapse, Hidden } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { State } from '../Model';
import BraveCaution from './BraveCaution';
import Copyright from './Copyright';
import PageFooter from './PageFooter';
import HitList from './HitList';
import PageHeader from './PageHeader';
import { Action } from '../Update';

const HEIGHT_THRESHOLD = 480;

const Layout = ({
  state,
  dispatch,
  children,
}: {
  state: State;
  children: React.ReactNode;
  dispatch: React.Dispatch<Action>;
}) => {
  const location = useLocation();
  const [isParse, setIsPase] = useState(false);
  const [isHideAppBar, setIsHideAppBar] = useState(false);

  const { search, auth, layout } = state;
  const { uid } = auth;
  const { hitItems } = search;
  const { isBrave } = layout;

  // スマホで文の形を表示する時にヘッダーを隠す
  useEffect(() => {
    const isParse = location.pathname.split('/').slice(-1)[0] === 'parse';
    const isHideAppBar = isParse && window.innerHeight < HEIGHT_THRESHOLD;
    setIsPase(isParse);
    setIsHideAppBar(isHideAppBar);
  }, [location.pathname]);

  // スマホで文の形を表示する時にヘッダーを隠す
  useEffect(() => {
    const onResize = () => {
      setIsHideAppBar(window.innerHeight < HEIGHT_THRESHOLD && isParse);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [isParse]);

  return (
    <>
      {isBrave && <BraveCaution />}

      <div>
        <div
          style={{
            display: 'flex',
            minHeight: 'calc(100vh - 56px)',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ overflowX: 'scroll' }}>{children}</div>
          {!!uid && <Copyright />}
        </div>

        {!isHideAppBar && (
          <>
            <PageHeader state={state} dispatch={dispatch} />
            <Collapse in={!!hitItems.length}>
              <HitList state={state} dispatch={dispatch} />
            </Collapse>
          </>
        )}

        <div
          style={{
            position: 'fixed',
            bottom: 0,
            zIndex: 100,
            width: '100vw',
          }}
        >
          <Hidden smUp>
            {!!uid && !isHideAppBar && (
              <PageFooter dispatch={dispatch} state={state} />
            )}
          </Hidden>
        </div>
      </div>
    </>
  );
};

export default Layout;