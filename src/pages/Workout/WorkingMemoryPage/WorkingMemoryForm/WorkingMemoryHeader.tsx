import { WorkingMemoryFormState } from '../Model';

const WorkingMemoryHeader = ({ state }: { state: WorkingMemoryFormState }) => {
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
      {state.currentIndex < state.cueCount + state.offset && (
        <div style={{ textAlign: 'center', letterSpacing: 4 }}>
          <span>{Math.min(state.currentIndex + 1, state.cueCount)}</span>
          <span>/</span>
          <span>{state.cueCount}</span>
        </div>
      )}
    </div>
  );
};

export default WorkingMemoryHeader;
