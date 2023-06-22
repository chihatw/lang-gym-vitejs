import Line from './Line';
import Mora from './Mora';

type PitchLineProps = {
  /**
   * 高ピッチは ["あ","h"]、低ピッチは ["あ"]、尾高は最後に [""]追加、['m']はミュート、空文字のみも許可
   */
  pitches: string[][];
  /**
   * リズムの境界線を表示
   */
  hasBorders?: boolean;
  /**
   * 1拍から開始
   */
  isOddStart?: boolean;
  /**
   * 既定値はRoboto
   */
  fontFamily?: string;
  /**
   * 既定値は0
   */
  paddingBottom?: number;
};

export function PitchLine({
  pitches,
  hasBorders,
  fontFamily,
  isOddStart,
  paddingBottom,
}: PitchLineProps) {
  // 後方互換のため、 !!pitches のチェックが必要
  const isEmpty = !!pitches[0] && pitches[0][0] === '';
  if (isEmpty) {
    // 空要素
    return <div style={{ height: 40, width: 15 }} />;
  } else {
    const isMute = !!pitches && pitches[0] && ['m'].includes(pitches[0][0]);
    if (isMute) {
      // ミュート
      return (
        <Mora mora={''} index={0} isMute isOdaka={false} currentPitch={false} />
      );
    } else {
      const pitchArray = pitches.map((i) => !!i[1]);

      const isOdaka =
        pitches.length > 1 && // pitchesの長さが1より大きい
        // pitchesの最後から二つ目が高ピッチ
        !!pitches.slice(-2, -1)[0][1] &&
        // pitchesの最後が空文字列
        pitches.slice(-1)[0][0] === '';

      const moraArray = pitches.map((i) => i[0]);

      // 尾高の場合、最後の[""]を取り除く
      if (!!pitches && isOdaka) {
        pitchArray.pop();
        moraArray.pop();
      }

      return (
        <div
          style={{
            position: 'relative',
            paddingBottom: paddingBottom || 0,
          }}
        >
          <Line isOdaka={isOdaka} pitchArray={pitchArray} />
          <div style={{ display: 'flex' }}>
            {moraArray.map((mora, index) => {
              const isLast = index === moraArray.length - 1;
              return (
                <Mora
                  key={index}
                  mora={mora}
                  index={index}
                  isLast={isLast}
                  isOdaka={isOdaka}
                  hasBorder={hasBorders}
                  fontFamily={fontFamily}
                  isOddStart={isOddStart}
                  currentPitch={pitchArray[index]}
                  nextPitch={!isLast ? pitchArray[index + 1] : undefined}
                />
              );
            })}
          </div>
        </div>
      );
    }
  }
}
