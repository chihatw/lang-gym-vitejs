import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../../App';
import { State } from '../../../../../../Model';
import { deleteStorage } from '../../../../../../repositories/storage';
import { updateSentence } from '../../../../../../services/article';

import { Action, ActionTypes } from '../../../../../../Update';

const RemoveAudioButton = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { articlePage } = state;
  const { sentences } = articlePage;

  const sentence = sentences[sentenceIndex];
  const { id, storagePath } = sentence;

  const handleDelete = () => {
    if (!dispatch) return;
    if (window.confirm('音声ファイルを削除しますか')) {
      dispatch({ type: ActionTypes.removeAssignmentBlob, payload: id });
      // storage
      deleteStorage(storagePath);
      // firestore
      updateSentence(id, '', 0);
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton sx={{ color: '#aaa' }} onClick={handleDelete}>
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default RemoveAudioButton;
