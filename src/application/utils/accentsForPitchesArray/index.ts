export const accentsForPitchesArray = (
  accents: {
    moras: string[];
    pitchPoint: number;
  }[]
): string[][][] => {
  const pitchesArray: string[][][] = []; // 拍: [label, high?]; 文節: [拍]; 文: [文節]
  accents.forEach((accent) => {
    const wordPitch: string[][] = [];
    const moras = accent.moras;
    const pitchPoint = accent.pitchPoint;
    moras.forEach((mora, index) => {
      const moraPitch: string[] = [];
      moraPitch.push(mora); // 拍のラベル

      const isHighPitch =
        pitchPoint === 0
          ? index > 0
          : pitchPoint === 1
          ? !index
          : !!index && index < pitchPoint;
      isHighPitch && moraPitch.push('h');
      wordPitch.push(moraPitch);
    });
    pitchesArray.push(wordPitch);
  });
  return pitchesArray;
};
