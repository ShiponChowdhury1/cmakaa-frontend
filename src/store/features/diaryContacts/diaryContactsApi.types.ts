export interface DiaryContactUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface DiaryContact {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  user: DiaryContactUser;
}

export interface CreateDiaryContactRequest {
  fullName: string;
  phone: string;
  email: string;
  notes?: string;
}

export interface UpdateDiaryContactRequest {
  fullName?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface DiaryContactsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DiaryContact[];
}

export interface DiaryContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: DiaryContact;
}

export interface DeleteDiaryContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}
