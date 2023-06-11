import React, { useContext } from 'react';

import AssignmentAudioPlayer from './AssignmentAudioPlayer';
import MicTogglePane from './MicTogglePane';

import { AppContext } from '../../../../..';
import { useParams } from 'react-router-dom';

const AssignmentPitches = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { articleId } = useParams();
  if (!articleId) return <></>;
  const { state } = useContext(AppContext);
  const { articlePages } = state;
  const articlePage = articlePages[articleId];
  const { sentences, assignmentBlobs } = articlePage;

  const sentence = sentences[sentenceIndex];

  const { storagePath } = sentence;

  const blob = assignmentBlobs[sentence.id];
  // 新式
  // storage の blob がある場合は、プレイヤーを表示
  if (!!storagePath && !!blob) {
    return <AssignmentAudioPlayer sentenceIndex={sentenceIndex} />;
  }
  // storage がない場合は、マイクを表示
  return <MicTogglePane sentenceIndex={sentenceIndex} />;
};

export default AssignmentPitches;
