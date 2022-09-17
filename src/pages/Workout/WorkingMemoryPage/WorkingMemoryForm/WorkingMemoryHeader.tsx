import { WorkingMemoryFormState } from '../Model';

const WorkingMemoryHeader = ({ state }: { state: WorkingMemoryFormState }) => {
  const cueCount = state.baseCueCount + state.step * state.offset;
  return (
    <div style={{ display: 'grid', rowGap: 16, color: '#555' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          letterSpacing: 4,
          alignItems: 'flex-end',
        }}
      >
        <span>前</span>
        <span style={{ fontSize: 28, fontWeight: 'bold' }}>{state.offset}</span>
        <span>項</span>
      </div>
      <div style={{ textAlign: 'center', letterSpacing: 4 }}>
        <span>{Math.min(state.currentIndex + 1, cueCount)}</span>
        <span>/</span>
        <span>{cueCount}</span>
      </div>
    </div>
  );
};

export default WorkingMemoryHeader;
