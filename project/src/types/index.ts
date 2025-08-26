export interface UploadedFile {
  id: number;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  isComplete: boolean;
}

export interface TimesheetEntry {
  employeeId: string;
  name: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hoursWorked: number;
  project: string;
  taskDescription: string;
}