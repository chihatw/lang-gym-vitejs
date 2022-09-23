type NumberCard = {
  id: string;
  end: number;
  start: number;
  label: string;
};

export const NUMBERS: { [id: string]: NumberCard } = {
  '0': { id: '0', end: 0.3, start: 1.2, label: '零' },
  '1': { id: '1', end: 2.4, start: 1.7, label: '一' },
  '2': { id: '2', end: 2.9, start: 2.5, label: '二' },
  '3': { id: '3', end: 4.6, start: 4.0, label: '三' },
  '4': { id: '4', end: 5.9, start: 5.3, label: '四' },
  '5': { id: '5', end: 7.2, start: 6.5, label: '五' },
  '6': { id: '6', end: 8.5, start: 7.7, label: '六' },
  '7': { id: '7', end: 9.7, start: 8.8, label: '七' },
  '8': { id: '8', end: 10.9, start: 10.2, label: '八' },
  '9': { id: '9', end: 12.2, start: 11.5, label: '九' },
};
