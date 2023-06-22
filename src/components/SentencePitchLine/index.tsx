import { PitchLine } from '../PitchLine';

type SentencePitchLineProps = {
  /**
   * pitchesの配列: string[][][]
   * 高ピッチは ["あ","h"]、低ピッチは ["あ"]、尾高は最後に [""]追加、['m']はミュート、空文字のみも許可。
   * */
  pitchesArray: string[][][];
  /**
   * リズムの境界線を描画
   */
  hasBorders?: boolean;
};

export function SentencePitchLine({
  hasBorders,
  pitchesArray,
}: SentencePitchLineProps) {
  let totalMoras = 0;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {pitchesArray.map((pitches, index) => {
        const _totalMoras = totalMoras;
        // pitches が [['']] の時、totalMoras をリセット
        if (pitches.length === 1 && !pitches[0][0]) {
          totalMoras = 0;
        } else {
          totalMoras += pitches.length;
        }
        return (
          <div key={index}>
            <PitchLine
              pitches={pitches}
              hasBorders={hasBorders}
              isOddStart={!!(_totalMoras % 2)}
            />
          </div>
        );
      })}
    </div>
  );
}
