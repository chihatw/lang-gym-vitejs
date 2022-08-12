import { css } from '@emotion/css';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase } from '@mui/material';
import React, { useContext, useState } from 'react';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { State } from '../../Model';
import { Action, ActionTypes } from '../../Update';
import { getSentencesByTags } from '../../services/article';
import { AppContext } from '../../App';

const SearchField = () => {
  const { state, dispatch } = useContext(AppContext);
  const [input, setInput] = useState('');

  const { memo, auth } = state;
  const { uid } = auth;
  const { hitItems: memoHitItems } = memo;

  const handleChange = async (input: string) => {
    if (!dispatch) return;
    setInput(input);
    const keywords = input
      .replace(/[a-zA-Z]/g, '')
      .replace(/\u3000/g, ' ')
      .split(' ')
      .filter((i) => i);

    const hitItems =
      memoHitItems[keywords.join(',')] ||
      (await getSentencesByTags(uid, keywords));
    dispatch({
      type: ActionTypes.inputSearch,
      payload: { keywords, hitItems },
    });
  };

  const handleClick = () => {
    if (!dispatch) return;
    setInput('');
    dispatch({ type: ActionTypes.clearSearch });
  };

  return (
    <div
      style={{
        width: '100%',
        position: 'relative',
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          padding: '0 8px',
          position: 'absolute',
          userSelect: 'none',
          alignItems: 'center',
          pointerEvents: 'none',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white' }}>
          <SearchIcon />
        </span>
      </div>
      <InputBase
        placeholder='請輸入欲查詢的字詞...'
        className={css({
          width: '100%',
          '.MuiInputBase-input': {
            color: 'white',
            fontWeight: 400,
            fontFamily: '"M PLUS Rounded 1c"',
            caretColor: 'white',
            paddingLeft: 'calc(1em + 24px)',
            paddingRight: 40,
          },
          '.MuiInputBase-input::placeholder': {
            color: 'white',
            fontFamily: '"M PLUS Rounded 1c"',
          },
        })}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      <div style={{ position: 'absolute', right: 3, top: 1 }}>
        <IconButton size='small' onClick={handleClick}>
          <ClearRoundedIcon sx={{ color: 'white', opacity: 0.4 }} />
        </IconButton>
      </div>
    </div>
  );
};

export default SearchField;
