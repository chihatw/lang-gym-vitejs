export const currentTimeToSliderValue = (
  currentTime: number,
  duration: number
): number => {
  const value = duration ? (currentTime / duration) * 100 : 0;
  return Math.min(Math.max(value, 0), 100);
};

export const sliderValueToCurrentTime = (
  sliderValue: number,
  duration: number
): number => {
  return (duration * sliderValue) / 100;
};
