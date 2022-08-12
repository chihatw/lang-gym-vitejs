import React, { useContext } from 'react';

import AssignmentAudioPlayer from './AssignmentAudioPlayer';
import SentencePitches from '../SentencePitches';
import MicTogglePane from './MicTogglePane';

import { State } from '../../../../../Model';
import { INITIAL_ASSIGNMENT_SENTENCE } from '../../../../../services/article';
import { Action } from '../../../../../Update';
import { AppContext } from '../../../../../App';

const AssignmentPitches = ({ sentenceIndex }: { sentenceIndex: number }) => {
  const { state, dispatch } = useContext(AppContext);
  const { articlePage } = state;
  const {
    sentences,
    assignmentBlob,
    assignmentBlobs,
    assignmentDownloadURL,
    articleAssignmentSentences,
  } = articlePage;

  const sentence = sentences[sentenceIndex];

  const assignmentSentence =
    articleAssignmentSentences[sentenceIndex] || INITIAL_ASSIGNMENT_SENTENCE;

  const { storagePath } = sentence;

  if (assignmentDownloadURL) {
    // 旧式
    if (!!assignmentSentence.pitchesArray.length && assignmentBlob) {
      return <SentencePitches isAssignment sentenceIndex={sentenceIndex} />;
    }
    return <></>;
  }

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
