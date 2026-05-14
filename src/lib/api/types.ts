export type ApiHealthResponse = {
  status: string;
  message: string;
  timestamp: string;
};

export type ApiStatusResponse = {
  api: string;
  version: string;
  status: string;
  uptime: number;
  environment: string;
  timestamp: string;
};