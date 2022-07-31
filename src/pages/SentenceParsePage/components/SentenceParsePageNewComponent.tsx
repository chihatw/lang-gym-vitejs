import { SentenceFormPane } from '@chihatw/sentence-form.sentence-form-pane';
import React, { useEffect, useState } from 'react';
import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';

import SentenceHeader from './components/SentenceHeader';
import SentenceParseListHeader from './components/SentenceParseListHeader';
import SentenceParseListWrapper from './components/SentenceParseListWrapper';
import { Divider } from '@mui/material';
import { FSentences } from 'fsentence-types';
import { ArticleSentenceForm } from '../../../Model';

const HEIGHT_THRESHOLD = 480;

const SentenceParsePageNewComponent = ({
  marks,
  title,
  embedID,
  createdAt,
  sentences,
  handleBack,
  articleSentenceForms,
}: {
  marks: string[];
  title: string;
  embedID: string;
  sentences: {
    id: string;
    line: number;
    chinese: string;
    japanese: string;
  }[];
  createdAt: number;
  articleSentenceForms: ArticleSentenceForm[];
  handleBack: () => void;
}) => {
  const [isHideAppBar, setIsHideAppBar] = useState(
    window.innerHeight < HEIGHT_THRESHOLD
  );
  const [isMiniScreen, setIsMiniScreen] = useState(true);
  const [ytPlayer, setYtPlayer] = useState<any>(null);
  const [playerState, setPlayerState] = useState(-1);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const onResize = () => {
      setIsHideAppBar(window.innerHeight < HEIGHT_THRESHOLD);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onToggleIsMiniScreen = () => {
    setIsMiniScreen(!isMiniScreen);
  };

  const onMute = () => {
    if (!!ytPlayer.isMuted()) {
      ytPlayer.unMute();
    } else {
      ytPlayer.mute();
    }
    setIsMuted(!ytPlayer.isMuted());
  };

  const onPause = () => {
    if (playerState === 1) {
      ytPlayer.pauseVideo();
    } else {
      ytPlayer.playVideo();
    }
  };
  return (
    <SentenceParseListWrapper
      isHideAppBar={isHideAppBar}
      handleBack={handleBack}
    >
      <div>
        <div style={{ height: 48 }} />
        <SentenceParseListHeader
          title={title}
          createdAt={createdAt}
          isHideAppBar={isHideAppBar}
          isMuted={isMuted}
          isMiniScreen={isMiniScreen}
          onMute={onMute}
          handleBack={handleBack}
          onToggleIsMiniScreen={onToggleIsMiniScreen}
        />
        <div
          style={{
            padding: '16px 0 24px',
            width: isMiniScreen ? '45vw' : 'auto',
          }}
        >
          <YoutubeEmbeded
            embedId={embedID}
            setYtPlayer={setYtPlayer}
            setPlayerState={setPlayerState}
            isShowControls={false}
            offSet={400}
            transition={1000}
          />
        </div>

        <div
          style={{
            height: 600,
            overflowY: 'scroll',
            border: '1px solid #ddd',
            borderRadius: 4,
          }}
        >
          {sentences.map(({ line, japanese, chinese }, index) => {
            const articleSentenceForm = articleSentenceForms[index];
            return (
              <SentenceFormRow
                key={index}
                mark={marks[index]}
                line={line}
                japanese={japanese}
                chinese={chinese}
                isMuted={isMuted}
                ytPlayer={ytPlayer}
                playerState={playerState}
                sentences={articleSentenceForm.sentences}
                hasNext={!!sentences[index + 1]}
                onMute={onMute}
                onPause={onPause}
              />
            );
          })}
          <div style={{ height: 400 }} />
        </div>
      </div>
    </SentenceParseListWrapper>
  );
};

export default SentenceParsePageNewComponent;

const SentenceFormRow = ({
  mark,
  isMuted,
  ytPlayer,
  playerState,
  sentences,
  japanese,
  chinese,
  line,
  hasNext,
  onMute,
  onPause,
}: {
  mark: string;
  isMuted: boolean;
  ytPlayer: any;
  line: number;
  chinese: string;
  japanese: string;
  playerState: number;
  sentences: FSentences;
  hasNext: boolean;
  onMute: () => void;
  onPause: () => void;
}) => {
  return (
    <div
      style={{
        color: '#555',
        padding: '16px 16px 8px',
        display: 'grid',
        rowGap: 16,
      }}
    >
      <SentenceHeader
        mark={mark}
        isMuted={isMuted}
        ytPlayer={ytPlayer}
        line={line}
        playerState={playerState}
        onMute={onMute}
        onPause={onPause}
      />
      <JapaneseLine japanese={japanese} />
      <ChineseLine chinese={chinese} />
      {!!Object.keys(sentences).length && (
        <SentenceFormPane sentences={sentences} />
      )}
      {!!hasNext && <Divider />}
    </div>
  );
};

const JapaneseLine: React.FC<{ japanese: string }> = ({ japanese }) => {
  return (
    <div
      style={{
        fontSize: 14,
        fontFamily: '"Noto Serif JP"',
      }}
    >
      {japanese}
    </div>
  );
};

const ChineseLine: React.FC<{ chinese: string }> = ({ chinese }) => {
  return (
    <div
      style={{
        fontSize: 12,
        color: '#52a2aa',
        fontFamily: '"M PLUS Rounded 1c"',
      }}
    >
      {chinese}
    </div>
  );
};
