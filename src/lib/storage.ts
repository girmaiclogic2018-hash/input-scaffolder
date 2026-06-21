export interface Employee {
  id: string;
  fullName: string;
  employeeId: string;
  department: string;
  position: string;
  salary: number;
  type: 'government' | 'private';
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  offline?: boolean;
}

const KEYS = {
  EMPLOYEES: 'hr_employees_v2',
  ATTENDANCE: 'hr_attendance_v2',
  SETTINGS: 'hr_settings_v2',
};

export const storage = {
  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(KEYS.EMPLOYEES);
    return data ? JSON.parse(data) : [];
  },
  saveEmployee: (employee: Employee) => {
    const employees = storage.getEmployees();
    const index = employees.findIndex((e) => e.id === employee.id);
    if (index > -1) {
      employees[index] = employee;
    } else {
      employees.push(employee);
    }
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },
  deleteEmployee: (id: string) => {
    const employees = storage.getEmployees().filter((e) => e.id !== id);
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(employees));
  },
  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },
  saveAttendance: (record: AttendanceRecord) => {
    const attendance = storage.getAttendance();
    const index = attendance.findIndex((a) => a.id === record.id);
    if (index > -1) {
      attendance[index] = record;
    } else {
      attendance.push(record);
    }
    localStorage.setItem(KEYS.ATTENDANCE, JSON.stringify(attendance));
  },
  getSettings: () => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { voiceHints: true, theme: 'light' };
  },
  saveSettings: (settings: any) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },
};
