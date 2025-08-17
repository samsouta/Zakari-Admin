import { UserType } from "./authTypes";

export interface UploadType {
  id: string;
  user_id: number;
  original_name: string;
  mime: string;
  size: number;
  disk: string;
  path: string;
  checksum: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  url: string | null;
}


export interface TopUpType {
  id: number;
  upload_id: string;
  user_id: number;
  amount: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  upload: UploadType;
  user: UserType;
}

export interface GetTopUpResponse {
    success: boolean ;
    message: string;
    data: TopUpType[];
}
