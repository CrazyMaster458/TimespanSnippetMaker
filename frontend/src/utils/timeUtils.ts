export const parseTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':');
    
    return {
      hours: hours.padStart(2, '0'),
      minutes: minutes.padStart(2, '0'),
      seconds: seconds.padStart(2, '0'),
    };
};