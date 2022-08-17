import * as R from 'ramda';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../../../App';
import { deleteStorage } from '../../../../../../../repositories/storage';
import { updateSentence } from '../../../../../../../services/article';

import { ActionTypes } from '../../../../../../../Update';
import { Sentence, State } from '../../../../../../../Model';

const RemoveAudioButton = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { articlePage } = state;
  const { sentences } = articlePage;

  const sentence = sentences[sentenceIndex];
  const { id, storagePath } = sentence;

  const handleDelete = () => {
    if (!dispatch) return;
    if (window.confirm('音声ファイルを削除しますか')) {
      const updatedSentences = sentences.map((s) =>
        s.id !== id ? s : { ...s, storageDuration: 0, storagePath: '' }
      );

      const updatedState = R.compose(
        R.dissocPath<State>(['articlePage', 'assignmentBlobs', id]),
        R.assocPath<Sentence[], State>(
          ['articlePage', 'sentences'],
          updatedSentences
        )
      )(state);
      dispatch({ type: ActionTypes.setState, payload: updatedState });

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
