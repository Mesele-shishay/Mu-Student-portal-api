// HTTP Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Request Types
export interface RequestQuery {
  page?: string;
  limit?: string;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface RequestParams {
  id?: string;
  [key: string]: string | undefined;
}

// Cookie Types
export interface CookieData {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

export interface CookieJarOptions {
  rejectPublicSuffixes?: boolean;
  looseMode?: boolean;
}

// Scraping Types
export interface ScrapingOptions {
  url: string;
  method?: "GET" | "POST";
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  timeout?: number;
  followRedirects?: boolean;
  validateStatus?: (status: number) => boolean;
}

export interface ScrapingResult<T = unknown> {
  data: T;
  cookies: CookieData[];
  statusCode: number;
  headers: Record<string, string>;
  url: string;
}

// HTML Parsing Types
export interface HtmlParseOptions {
  selector?: string;
  attributes?: string[];
  text?: boolean;
  html?: boolean;
  multiple?: boolean;
}

export interface ParsedElement {
  text?: string | undefined;
  html?: string | undefined;
  attributes: Record<string, string>;
  tagName: string;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string | undefined;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

// Logger Types
export interface LogLevel {
  error: 0;
  warn: 1;
  info: 2;
  http: 3;
  debug: 4;
}

export interface LogEntry {
  level: keyof LogLevel;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown> | undefined;
}

// Configuration Types
export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: keyof LogLevel;
  corsOrigin: string;
  requestTimeout: number;
  userAgent: string;
}

// Middleware Types
export interface AuthenticatedRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface RateLimitInfo {
  limit: number;
  current: number;
  remaining: number;
  resetTime: Date;
}

// Feature-specific Types
export interface WebScrapingFeature {
  scrapeUrl: (options: ScrapingOptions) => Promise<ScrapingResult>;
  parseHtml: (html: string, options: HtmlParseOptions) => ParsedElement[];
  extractData: <T>(html: string, selectors: Record<string, string>) => T;
}

export interface CookieManagementFeature {
  createCookieJar: (options?: CookieJarOptions) => unknown;
  addCookies: (cookies: CookieData[]) => void;
  getCookies: () => CookieData[];
  clearCookies: () => void;
}

// Controller Types
export interface BaseController {
  index: (req: Express.Request, res: Express.Response) => Promise<void>;
  show: (req: Express.Request, res: Express.Response) => Promise<void>;
  create: (req: Express.Request, res: Express.Response) => Promise<void>;
  update: (req: Express.Request, res: Express.Response) => Promise<void>;
  delete: (req: Express.Request, res: Express.Response) => Promise<void>;
}

// Service Types
export interface BaseService<T> {
  findAll: (query?: RequestQuery) => Promise<T[]>;
  findById: (id: string) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T | null>;
  delete: (id: string) => Promise<boolean>;
}

// Route Types
export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  handler: (req: Express.Request, res: Express.Response) => Promise<void>;
  middleware?: any[];
  validation?: unknown;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Express Extensions
declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      requestId?: string;
    }
  }
}

// Login Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  authenticated: boolean;
  user?: {
    username: string;
    role?: string;
    name?: string;
  };
  session?: {
    cookies: CookieData[];
    sessionId?: string;
  };
  error?: string;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  user?: {
    username: string;
    role?: string;
    name?: string;
  };
  sessionId?: string;
  lastActivity?: Date;
}

// Student Data Types
export interface StudentProfile {
  full_name: string;
  id_number: string;
  admission_year: string;
  department: string;
  program: string;
  class_year: string;
  section: string;
  role: string;
  profile_image: string;
}

export interface PersonalDetails {
  first_name: string;
  father_name: string;
  grand_father_name: string;
  full_name_amharic: string;
  gender: string;
  marital_status: string;
  nationality: string;
  ethnicity: string;
  disability: string;
  date_of_birth: string;
  place_of_birth: string;
}

export interface ContactAddress {
  country: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  street_address: string;
  home_telephone: string;
  mobile: string;
  work_telephone: string;
  email: string;
}

export interface EmergencyContact {
  full_name: string;
  relationship: string;
  home_telephone: string;
  mobile: string;
  work_telephone: string;
}

export interface FamilyMember {
  full_name: string;
  relation: string;
  date_of_birth: string;
  education_level: string;
  occupation: string;
}

export interface Education {
  institution: string;
  education_type: string;
  study_field: string;
  qualification: string;
  from: string;
  to: string;
  grade: number;
  scale: number;
}

export interface CostSharingBreakdown {
  semester: string;
  education: number;
  cafe: number;
  accommodation: number;
  total: number;
}

export interface CostSharing {
  total: number;
  breakdown: CostSharingBreakdown[];
}

export interface GPASummary {
  academic_status: string;
  semester_gpa: number;
  cumulative_gpa: number;
}

export interface AcademicInfo {
  college: string;
  admission_type: string;
  registration_number: string;
  matriculation_result: number;
  tuition_type: string;
}

export interface StudentPersonalInfo {
  student_profile: StudentProfile;
  personal_details: PersonalDetails;
  contact_address: ContactAddress;
  emergency_contact: EmergencyContact;
  family_background: FamilyMember[];
  education_background: Education[];
  program_preferences: string[];
  registration_history: string[];
  cost_sharing: CostSharing;
  gpa_summary: GPASummary;
  academic_info: AcademicInfo;
}

export interface TranscriptEntry {
  moduleCode?: string | undefined;
  moduleTitle?: string | undefined;
  courseCode: string;
  courseTitle: string;
  ects: number;
  grade: string;
  points: number;
  semester: string;
  academicYear: string;
  year: string;
}

export interface Transcript {
  entries: TranscriptEntry[];
  warning?: string;
}

export interface StudentData {
  personalInfo: StudentPersonalInfo;
  academicInfo: Record<string, any>;
  courses: Array<{
    code?: string;
    title?: string;
    credits?: string;
    grade?: string;
    semester?: string;
  }>;
  grades: Array<{
    courseCode?: string;
    courseTitle?: string;
    grade?: string;
    points?: string;
    semester?: string;
  }>;
  schedule: Array<{
    day?: string;
    time?: string;
    course?: string;
    room?: string;
    instructor?: string;
  }>;
  financialInfo: Record<string, any>;
  transcript?: Transcript;
}

export * from "./api.types";
export * from "./student.types";
