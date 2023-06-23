import { buildWordPitches } from '../buildWordPitches';

export const string2PitchesArray = (sentencePitchStr: string): string[][][] => {
  // 全角スペース(u3000)は半角スペース(u0020)に変換する
  sentencePitchStr = sentencePitchStr.replace(/\u3000/g, '\u0020');

  // 半角スペースで分割する
  const wordPitchStrs = sentencePitchStr
    ? sentencePitchStr.split('\u0020')
    : [];

  return wordPitchStrs.map((wordPitchStr) => buildWordPitches(wordPitchStr));
};
