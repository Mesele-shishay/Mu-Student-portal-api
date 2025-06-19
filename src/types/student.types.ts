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

export interface Course {
  code?: string;
  title?: string;
  credits?: string;
  grade?: string;
  semester?: string;
}

export interface Grade {
  courseCode?: string;
  courseTitle?: string;
  grade?: string;
  points?: string;
  semester?: string;
}

export interface Schedule {
  day?: string;
  time?: string;
  course?: string;
  room?: string;
  instructor?: string;
}

export interface Payment {
  date?: string;
  amount?: string;
  description?: string;
}

export interface FinancialInfo {
  balance?: string;
  paidAmount?: string;
  dueAmount?: string;
  paymentHistory?: Payment[];
}

export interface TranscriptEntry {
  moduleCode?: string;
  moduleTitle?: string;
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
  warning?: string;
  entries: TranscriptEntry[];
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

export interface StudentData {
  personalInfo: StudentPersonalInfo;
  academicInfo: AcademicInfo;
  courses: Course[];
  grades: Grade[];
  schedule: Schedule[];
  financialInfo: FinancialInfo;
  transcript: Transcript;
}
