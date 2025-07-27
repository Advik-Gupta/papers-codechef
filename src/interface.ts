// export interface CloudinaryUploadResult {
//   id: string;
//   batchId: string;
//   asset_id: string;
//   public_id: string;
//   version: number;
//   version_id?: string;
//   signature: string;
//   width: number;
//   height: number;
//   format: string;
//   access_mode: string;
//   bytes: number;
//   created_at: string;
//   etag: string;
//   folder: string;
//   original_filename: string;
//   path: string;
//   placeholder: boolean;
//   resource_type: string;
//   secure_url: string;
//   tags: string[];
//   thumbnail_url: string;
//   type: string;
//   url: string;

import { mongo } from "mongoose";

// }
export interface CloudinaryUploadResult {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
}
export interface IUpcomingSlot {
  slot: string;
}
export interface IUpcomingSubject {
  subject: string;
  slots: string[];
}
export interface CloudinaryUploadWidgetProps {
  info: CloudinaryUploadResult;
  event?: string;
}

export interface PostRequestBody {
  tags: string;
}

export interface PaperResponse {
  finalUrl: string;
  subject: string;
  year: string;
  slot: string;
  exam: string;
}
export interface IAdminPaper {
  public_id_cloudinary: string;
  finalUrl: string;
  thumbnailUrl: string;
  subject: string | null;
  slot: string | null;
  year: string | null;
  exam: "CAT-1" | "CAT-2" | "FAT" | "Model" | null;
  semester:
    | "Fall Semester"
    | "Winter Semester"
    | "Summer Semester"
    | "Weekend Semester"
    | null;
  campus:
    | "Vellore"
    | "Chennai"
    | "Andhra Pradesh"
    | "Bhopal"
    | "Bangalore"
    | "Mauritius"
    | null;
  answerKeyIncluded?: boolean | null;
  cloudinary_index: number;
  isSelected?: boolean;
}

export interface ICourses {
  name: string;
}
export interface IAdminUpload {
  formData: FormData;
  files: File[];
  publicIds: Array<string>;
  subject: string;
  slot: string;
  year: string;
  exam: "CAT-1" | "CAT-2" | "FAT";
  isPdf: boolean;
}
export interface APIResponse {
  message: string;
  status: number;
}
export interface ConverttoPDFResponse {
  url: string;
  secure_url: string;
  asset_id: string;
  public_id: string;
  version: number;
}

export interface LoginResponse {
  token: string;
}

export interface ErrorResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface DecryptedLoginResponse {
  token: string;
  user: {
    email: string;
    id: string;
  };
}
export interface IUpcomingPaper extends mongo.Document {
  subject: string;
  slots: string[];
}
export interface IPaper {
  _id: string;
  exam: "CAT-1" | "CAT-2" | "FAT" | "Model CAT-1" | "Model CAT-2" | "Model FAT";
  finalUrl: string;
  thumbnailUrl: string;
  semester:
    | "Fall Semester"
    | "Winter Semester"
    | "Summer Semester"
    | "Weekend Semester";
  campus:
    | "Vellore"
    | "Chennai"
    | "Andhra Pradesh"
    | "Bhopal"
    | "Bangalore"
    | "Mauritius";
  slot: string;
  subject: string;
  year: string;
  answerKeyIncluded?: boolean;
}
export type ExamDetail = {
  subject: string;
  slot: string;
  "course-code": string;
  exam: string;
  semester:
    | "Fall Semester"
    | "Winter Semester"
    | "Summer Semester"
    | "Weekend Semester";
  year: string;
  answerKeyIncluded: boolean | undefined;
};
export interface Filters {
  papers: IPaper[];
  uniqueExams: string[];
  uniqueSlots: string[];
  uniqueYears: string[];
  uniqueCampuses: string[];
  uniqueSemesters: string[];
}

export interface StoredSubjects {
  subjects: string[];
}
