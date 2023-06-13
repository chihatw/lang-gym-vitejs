import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audio/core/1-constants';
import { audioActions } from 'application/audio/framework/0-reducer';
import { useDispatch } from 'react-redux';

const RemoveAudioButton = ({ sentenceId }: { sentenceId: string }) => {
  const dispatch = useDispatch();
  const handleDelete = () => {
    if (window.confirm('音声ファイルを削除しますか')) {
      const path = ASSIGNMENTS_STORAGE_PATH + sentenceId;
      dispatch(audioActions.removeFetchedAudioBuffer(path));
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
