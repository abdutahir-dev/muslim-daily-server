export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface EndpointParam {
  name: string;
  type: 'path' | 'query' | 'header';
  required: boolean;
  defaultValue?: string;
  description: string;
  options?: string[];
}

export interface ApiEndpoint {
  id: string;
  category: string;
  name: string;
  method: HttpMethod;
  path: string;
  description: string;
  params?: EndpointParam[];
  sampleBody?: Record<string, unknown>;
  requiresAuth?: boolean;
}

export interface RequestState {
  endpoint: ApiEndpoint;
  resolvedPath: string;
  method: HttpMethod;
  queryParams: Record<string, string>;
  headers: Record<string, string>;
  body: string;
}

export interface ResponseResult {
  status: number;
  statusText: string;
  durationMs: number;
  sizeBytes: number;
  headers: Record<string, string>;
  data: unknown;
  timestamp: string;
  isError: boolean;
}

export interface AuthState {
  tokenType: 'bearer' | 'firebase';
  token: string;
  username?: string;
  firebaseConfig?: {
    projectId: string;
    firestoreDatabaseId: string;
  };
}
