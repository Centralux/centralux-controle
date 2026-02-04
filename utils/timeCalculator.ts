
import { AttendanceStatus } from '../types';

const STANDARD_ENTRY_MINS = 8 * 60 + 30; // 08:30
const TOLERANCE_END_MINS = 8 * 60 + 45; // 08:45

export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToFormatted = (totalMinutes: number): string => {
  const sign = totalMinutes < 0 ? '-' : '+';
  const absMins = Math.abs(totalMinutes);
  const h = Math.floor(absMins / 60);
  const m = absMins % 60;
  return `${sign}${h}h ${m}m`;
};

export const calculateBalance = (status: AttendanceStatus, arrivalTime: string | null): number => {
  if (status !== AttendanceStatus.PRESENT || !arrivalTime) {
    return 0;
  }

  const arrivalMins = timeToMinutes(arrivalTime);

  // Rule 1: Arrival before 08:30 -> Positive balance (time before 08:30)
  if (arrivalMins < STANDARD_ENTRY_MINS) {
    return STANDARD_ENTRY_MINS - arrivalMins;
  }

  // Rule 2: Arrival between 08:30 and 08:45 -> On time (0 balance)
  if (arrivalMins >= STANDARD_ENTRY_MINS && arrivalMins <= TOLERANCE_END_MINS) {
    return 0;
  }

  // Rule 3: Arrival after 08:45 -> Negative balance calculated from 08:45
  if (arrivalMins > TOLERANCE_END_MINS) {
    return TOLERANCE_END_MINS - arrivalMins;
  }

  return 0;
};
