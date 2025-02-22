

// Interfaces
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "ToDo",
  WorkInProgress = "WorkInProgress",
  UnderReview = "UnderReview",
  Completed = "Completed",
  task = "task",
}
export enum TaskTags {
  FEATURE = "FEATURE",
  BUG = "BUG",
  IMPROVEMENT = "IMPROVEMENT",
  DOCUMENTATION = "DOCUMENTATION",
}

export interface User {
  user: any;
  userId?: number;
  fullname?: string;
  password?: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  teamId?: number;
  role?: string;
  projects?: Project[];
}

export interface Task {
  id: number;
  teamName?: string;
  teamId?: number;
  title: string;
  description?: string;
  status?: Status | string;
  priority?: Priority;
  tags?: TaskTags[];
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId: number;
  assignedUserId?: number;
  attachments?: Attachment[];
  author?: User;
  assignee?: User;
  comments?: Comment[];
}

export interface Team {
  id?: number;
  projectName?: string;
  teamName: string;
  description?: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;

  productOwnerUsername?: string;
  projectManagerUsername?: string;

  membersIds?: number[];
  teamMembers?: User[];
  projectId?: number;
}

export interface Attachment {
  file: File;
  id: number;
  fileURL: string;
  fileName?: string;
  taskId: number;
  uploadedById: number;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}
