import { useMemo } from 'react';
import AssignmentAudioPlayer from './AssignmentAudioPlayer';
import MicTogglePane from './MicTogglePane';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { ASSIGNMENTS_STORAGE_PATH } from 'application/audio/core/1-constants';

const AssignmentPitches = ({ sentenceId }: { sentenceId: string }) => {
  const { fetchedAudioBuffers } = useSelector(
    (state: RootState) => state.audio
  );

  const assignmentAudioBuffer = useMemo(() => {
    const path = ASSIGNMENTS_STORAGE_PATH + sentenceId;
    return fetchedAudioBuffers[path];
  }, [sentenceId, fetchedAudioBuffers]);

  // assignmentAudioBuffer がある場合は、プレイヤーを表示
  if (!!assignmentAudioBuffer) {
    return (
      <AssignmentAudioPlayer
        sentenceId={sentenceId}
        assignmentAudioBuffer={assignmentAudioBuffer}
      />
    );
  }
  // assignmentAudioBuffer がない場合は、マイクを表示
  return <MicTogglePane sentenceId={sentenceId} />;
};

export default AssignmentPitches;
