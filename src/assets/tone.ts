type ToneCard = {
  id: string;
  end: number;
  start: number;
  label: string;
};

export const TONES: { [id: string]: ToneCard } = {
  ma1: { id: 'ma1', end: 1.3, start: 0.6, label: '媽' },
  ma2: { id: 'ma2', end: 2.5, start: 1.8, label: '麻' },
  ma3: { id: 'ma3', end: 3.7, start: 3.0, label: '馬' },
  ma4: { id: 'ma4', end: 4.7, start: 4.2, label: '罵' },
};
