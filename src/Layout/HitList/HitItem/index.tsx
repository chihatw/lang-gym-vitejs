import { css } from '@emotion/css';
import { Container, Divider, useTheme } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { State } from '../../../Model';
import { Action, ActionTypes } from '../../../Update';
import Highlight from './Highlight';

const HitItem = ({
  index,
  state,
  dispatch,
}: {
  index: number;
  state: State;
  dispatch: React.Dispatch<Action>;
}) => {
  const { search } = state;
  const { keywords, hitItems } = search;
  const { createdAt, article, japanese, kana, chinese, original, title, line } =
    hitItems[index];
  const theme = useTheme();
  const navigate = useNavigate();
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const handleClick = () => {
    dispatch({ type: ActionTypes.clearSearch });
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/article/${article}`);
  };
  return (
    <div
      className={css({
        cursor: 'pointer',
        '&:hover, &:active, &:focus': {
          background: '#eaf4f5',
        },
      })}
      onClick={handleClick}
    >
      <Container>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded,
            fontSize: 12,
            rowGap: 8,
            padding: '8px 0',
            display: 'grid',
          }}
        >
          {/* 日本語 */}
          <Highlight text={japanese} keywords={keywords} />

          {/* かな */}
          <div style={{ fontSize: 10 }}>
            <Highlight text={kana} keywords={keywords} />
          </div>

          {/* 中国語 */}
          <div style={{ color: '#52a2aa' }}>
            <Highlight text={chinese} keywords={keywords} />
          </div>

          {/* 原文 */}
          <div
            style={{
              color: '#52a2aa',
              padding: '8px 16px',
              fontSize: 10,
              background: '#eaf4f5',
              borderRadius: 8,
            }}
          >
            <div
              style={{
                ...(theme.typography as any).mPlusRounded500,
                color: '#52a2aa',
              }}
            >
              原文：
            </div>
            <Highlight text={original} keywords={keywords} />
          </div>

          {/* 出典 */}
          <div
            style={{
              textAlign: 'right',
              fontSize: 10,
              color: '#777',
            }}
          >
            {`${title} | ${`${year}年${month}月${day}日`} | ${line + 1}行目`}
          </div>
        </div>

        {!!hitItems[index + 1] && <Divider />}
      </Container>
    </div>
  );
};

export default HitItem;
