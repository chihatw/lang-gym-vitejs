import { Card, CardContent, useTheme } from '@mui/material';
import React, { useContext } from 'react';
import { WorkingMemory, WorkingMemoryAnswer } from '../../../Model';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../App';
import { ActionTypes } from '../../../Update';

const WorkingMemoryRow = ({
  workingMemory,
}: {
  workingMemory: WorkingMemory;
}) => {
  const { dispatch } = useContext(AppContext);

  const theme = useTheme();
  const navigate = useNavigate();
  const openWorkingMemoryPage = () => {
    if (!dispatch) return;
    dispatch({ type: ActionTypes.startFetching });
    navigate(`/memory/${workingMemory.id}`);
  };
  return (
    <Card
      sx={{
        cursor: 'pointer',
        WebkitTapHighlightColor: '#EAF4F5',
        '&:active,&:focus': { background: '#EAF4F5' },
      }}
      onClick={openWorkingMemoryPage}
      elevation={0}
    >
      <CardContent>
        <div
          style={{
            ...(theme.typography as any).mPlusRounded300,
            userSelect: 'none',
            display: 'grid',
            rowGap: 8,
            marginBottom: -16,
          }}
        >
          <div style={{ fontSize: 14 }}>{workingMemory.title}</div>
          <RecordList workingMemory={workingMemory} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkingMemoryRow;

const RecordList = ({ workingMemory }: { workingMemory: WorkingMemory }) => {
  return (
    <div style={{ display: 'grid', rowGap: 8 }}>
      <div style={{ fontSize: 12, color: '#aaa' }}>練習結果</div>
      <div>
        {Object.values(workingMemory.answers)
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((answer, index) => (
            <RecordRow answer={answer} key={index} />
          ))}
      </div>
    </div>
  );
};

const RecordRow = ({ answer }: { answer: WorkingMemoryAnswer }) => {
  const date = new Date(answer.createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (
    <div
      style={{
        color: '#52a2aa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{ fontSize: 12 }}
      >{`${year}/${month}/${day} ${hours}:${minutes}`}</div>
      <div style={{ fontSize: 16, display: 'flex', flexBasis: 100 }}>
        <div style={{ flexBasis: 60 }}>{`前${answer.offset}項`}</div>
        <div
          style={{ flexBasis: 40, textAlign: 'right' }}
        >{`${answer.correctRatio}%`}</div>
      </div>
    </div>
  );
};
