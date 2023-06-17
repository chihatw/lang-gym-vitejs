export const pitchesArray2String = (pitchesArray: string[][][]) => {
  const bunsetsus: string[] = [];
  for (const pitches of pitchesArray) {
    const moras: string[] = [];
    pitches.forEach((pitch, index) => {
      const mora = pitch[0];
      const high = pitch[1];
      const nextPitch = pitches[index + 1];

      moras.push(mora);
      // 自身が高音で
      if (!!high) {
        // 次のピッチがあって、低音の場合
        if (!!nextPitch && !nextPitch[1]) {
          moras.push('＼');
        }
      }
    });
    bunsetsus.push(moras.join(''));
  }
  return bunsetsus.join(' ');
};
