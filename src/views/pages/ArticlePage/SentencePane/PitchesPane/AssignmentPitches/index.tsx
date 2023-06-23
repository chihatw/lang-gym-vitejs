import AssignmentAudioPlayer from './AssignmentAudioPlayer';
import MicTogglePane from './MicTogglePane';
import { useSelector } from 'react-redux';
import { RootState } from 'main';
import { selectAssignmentAudioBuffer } from 'application/articlePage/framework/2-selector';

const AssignmentPitches = ({ sentenceId }: { sentenceId: string }) => {
  const assignmentAudioBuffer = useSelector((state: RootState) =>
    selectAssignmentAudioBuffer(state, sentenceId)
  );

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
