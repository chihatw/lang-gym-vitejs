import * as R from 'ramda';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { AppContext } from '../../../../../..';
import { deleteStorage } from '../../../../../../../infrastructure/repositories/storage';
import { updateSentence } from '../../../../../../../application/services/article';

import { ActionTypes } from '../../../../../../../Update';
import { Sentence, State } from '../../../../../../../Model';
import { useParams } from 'react-router-dom';

const RemoveAudioButton = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { state, dispatch } = useContext(AppContext);
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
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
