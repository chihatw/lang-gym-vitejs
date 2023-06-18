import { useSelector } from 'react-redux';
import { Divider } from '@mui/material';

import { RootState } from 'main';
import SentencePitchLine from 'views/components/SentencePitchLine';
import { selectPitchStr } from 'application/randomWorkoutPage/framework/2-selector';

function CheckPaneRow({ cueId }: { cueId: string }) {
  const pitchStr = useSelector((state: RootState) =>
    selectPitchStr(state, cueId)
  );

  if (!pitchStr) return <></>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <SentencePitchLine pitchStr={pitchStr} />
      </div>
      <Divider />
    </div>
  );
}

export default CheckPaneRow;
