type PitchCard = {
  id: string;
  end: number;
  start: number;
  pitchStr: string;
};

export const PITCHES: { [id: string]: PitchCard } = {
  ta: { id: 'ta', start: 0.6, end: 1.3, pitchStr: 'タ＼ッ' },
  taa: { id: 'taa', start: 1.8, end: 2.7, pitchStr: 'タ＼ー' },
  tan: { id: 'tan', start: 3.1, end: 3.7, pitchStr: 'タ＼ン' },
  tata: { id: 'tata', start: 4.4, end: 5.2, pitchStr: 'タ＼タ' },
  tatta: { id: 'tatta', start: 5.4, end: 6.5, pitchStr: 'タ＼ッタ' },
  taata: { id: 'taata', start: 7.0, end: 7.9, pitchStr: 'タ＼ータ' },
  tanta: { id: 'tanta', start: 8.6, end: 9.4, pitchStr: 'タ＼ンタ' },
  tatata: {
    id: 'tatata',
    start: 10.0,
    end: 10.9,
    pitchStr: 'タ＼タタ',
  },
  tatax: { id: 'tatax', start: 4.4, end: 5.2, pitchStr: 'タ＼タッ' },
  tataa: {
    id: 'tataa',
    start: 11.5,
    end: 12.4,
    pitchStr: 'タ＼ター',
  },
  tatan: {
    id: 'tatan',
    start: 13.1,
    end: 13.9,
    pitchStr: 'タ＼タン',
  },
  tattata: {
    id: 'tattata',
    start: 14.5,
    end: 15.6,
    pitchStr: 'タ＼ッタタ',
  },
  taatata: {
    id: 'taatata',
    start: 16.3,
    end: 17.2,
    pitchStr: 'タ＼ータタ',
  },
  tantata: {
    id: 'tantata',
    start: 18.1,
    end: 19.1,
    pitchStr: 'タ＼ンタタ',
  },
  tatatata: { id: 'tatatata', start: 19.8, end: 21.1, pitchStr: 'タ＼タタタ' },
  tatatta: {
    id: 'tatatta',
    start: 21.6,
    end: 22.7,
    pitchStr: 'タ＼タッタ',
  },
  tataata: {
    id: 'tataata',
    start: 23.3,
    end: 24.5,
    pitchStr: 'タ＼タータ',
  },
  tatanta: {
    id: 'tatanta',
    start: 25.1,
    end: 26.2,
    pitchStr: 'タ＼タンタ',
  },
  tatatax: {
    id: 'tatatax',
    start: 10,
    end: 10.9,
    pitchStr: 'タ＼タタッ',
  },
  tatataa: {
    id: 'tatataa',
    start: 26.9,
    end: 28,
    pitchStr: 'タ＼タター',
  },
  tatatan: {
    id: 'tatatan',
    start: 28.7,
    end: 29.8,
    pitchStr: 'タ＼タタン',
  },
  tattaa: {
    id: 'tattaa',
    start: 30.5,
    end: 31.6,
    pitchStr: 'タ＼ッター',
  },
  tattan: {
    id: 'tattan',
    start: 32.3,
    end: 33.4,
    pitchStr: 'タ＼ッタン',
  },
  taataa: {
    id: 'taataa',
    start: 34.0,
    end: 35.1,
    pitchStr: 'タ＼ーター',
  },
  taatan: {
    id: 'taatan',
    start: 35.8,
    end: 36.9,
    pitchStr: 'タ＼ータン',
  },
  tantaa: {
    id: 'tantaa',
    start: 37.5,
    end: 38.7,
    pitchStr: 'タ＼ンター',
  },
  tantan: {
    id: 'tantan',
    start: 39.3,
    end: 40.3,
    pitchStr: 'タ＼ンタン',
  },
};
