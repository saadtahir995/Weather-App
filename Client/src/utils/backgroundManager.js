// Background images for different times of day
const backgroundImages = {
  dawn: '/images/dawn.jpg',
  morning: '/images/morning.jpg',
  noon: '/images/noon.jpg',
  afternoon: '/images/afternoon.jpg',
  evening: '/images/evening.jpg',
  night: '/images/night.jpg'
};

// Time ranges for different parts of the day
const timeRanges = {
  dawn: { start: 5, end: 7 },
  morning: { start: 7, end: 11 },
  noon: { start: 11, end: 14 },
  afternoon: { start: 14, end: 17 },
  evening: { start: 17, end: 20 },
  night: { start: 20, end: 5 }
};

// Preload all background images
export const preloadImages = () => {
  Object.values(backgroundImages).forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

// Get the appropriate background based on time
export const getBackgroundForTime = (hour) => {
  // Convert hour to 24-hour format if needed
  const time = parseInt(hour);

  if (time >= timeRanges.dawn.start && time < timeRanges.dawn.end) {
    return { image: backgroundImages.dawn, textColor: 'black' };
  }
  if (time >= timeRanges.morning.start && time < timeRanges.morning.end) {
    return { image: backgroundImages.morning, textColor: 'black' };
  }
  if (time >= timeRanges.noon.start && time < timeRanges.noon.end) {
    return { image: backgroundImages.noon, textColor: 'black' };
  }
  if (time >= timeRanges.afternoon.start && time < timeRanges.afternoon.end) {
    return { image: backgroundImages.afternoon, textColor: 'black' };
  }
  if (time >= timeRanges.evening.start && time < timeRanges.evening.end) {
    return { image: backgroundImages.evening, textColor: 'white' };
  }
  return { image: backgroundImages.night, textColor: 'white' };
}; 