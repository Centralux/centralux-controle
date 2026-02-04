
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  JUSTIFIED_ABSENCE = 'JUSTIFIED_ABSENCE',
  OVERTIME = 'OVERTIME'
}

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, this should be hashed
  isAdmin: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  startDate: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  arrivalTime: string | null; // HH:mm format
  status: AttendanceStatus;
  balanceMinutes: number; // calculated bank balance
  overtimeMinutes: number; // separate overtime balance
  notes?: string;
}

export interface SummaryData {
  employeeId: string;
  name: string;
  totalBalance: number;
  absences: number;
  justifiedAbsences: number;
  onTimeCount: number;
}