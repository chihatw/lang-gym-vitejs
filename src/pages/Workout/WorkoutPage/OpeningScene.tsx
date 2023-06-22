import { Button, Card, CardContent, Container, useTheme } from '@mui/material';
import { SentencePitchLine } from '../../../components/SentencePitchLine';
import string2PitchesArray from 'string2pitches-array';

function OpeningScene({
  handleCloseOpening,
}: {
  handleCloseOpening: () => void;
}) {
  const theme = useTheme();
  const items: { pitchStr: string; chinese: string; japanese: string }[] = [
    { japanese: '聞き取れます', chinese: '聽得懂', pitchStr: 'ききとれま＼す' },
    {
      japanese: '聞き取れません',
      chinese: '聽不懂',
      pitchStr: 'ききとれませ＼ん',
    },
    {
      japanese: '聞き取れました',
      chinese: '當時聽得懂',
      pitchStr: 'ききとれま＼した',
    },
    {
      japanese: '聞き取れませんでした',
      chinese: '當時聽不懂',
      pitchStr: 'ききとれませ＼んでした',
    },
    {
      japanese: '先週からニュースを聞き始めました',
      chinese: '從上週開始聽新聞',
      pitchStr: 'せんしゅーから　ニュ＼ースを　ききはじめま＼した',
    },
    {
      japanese: '来週からニュースを聞き始めます',
      chinese: '從下週要開始聽新聞',
      pitchStr: 'らいしゅーから　ニュ＼ースを　ききはじめま＼す',
    },
    {
      japanese: 'ニュースを聞き始めた理由',
      chinese: '（已經）開始聽新聞的理由',
      pitchStr: 'ニュースを　ききはじ＼めた　りゆー',
    },
    {
      japanese: 'ニュースを聞き始める理由',
      chinese: '要開始新聞的理由',
      pitchStr: 'ニュースを　ききはじめ＼る　りゆー',
    },
  ];

  return (
    <Container maxWidth='sm'>
      <div style={{ height: 48 }} />
      <div style={{ height: 24 }} />
      <div style={{ display: 'grid', paddingBottom: 80, rowGap: 16 }}>
        <div
          style={{
            ...(theme.typography as any).notoSerifJP,
            display: 'grid',
            rowGap: 16,
          }}
        >
          <div>
            中国語を見て、日本語を正しく、速く発音する練習です。
            <br />
            音声を録音しながら、時間を計測します。
            <br />
          </div>
          <div>
            順不同で１つずつ中国語を提示します。
            <br />
            正しいアクセントで、なるべく速く発音してください。
            <br />
          </div>
          <div style={{ fontSize: 10 }}>
            ブラウザーのマイクを On にする必要があります。
            <br />
            最初に練習する時は、ブラウザーから「マイクの使用を許可しますか？」と確認されます。
            <br />
            <span style={{ color: 'red' }}>
              この音声はサーバーにアップロードされます
            </span>
            が、発音を確認する以外の目的には使用しません。
          </div>
        </div>
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent
              sx={{ marginBottom: -1, display: 'grid', rowGap: '4px' }}
            >
              <div style={{ ...(theme.typography as any).notoSerifJP }}>
                {item.chinese}
              </div>
              <div>
                <SentencePitchLine
                  pitchesArray={string2PitchesArray(item.pitchStr)}
                />
                <div
                  style={{
                    ...(theme.typography as any).notoSerifJP,
                    fontSize: 12,
                  }}
                >
                  {item.japanese}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          variant='contained'
          sx={{ color: 'white' }}
          onClick={handleCloseOpening}
        >
          練習開始
        </Button>
      </div>
    </Container>
  );
}

export default OpeningScene;
