import { CookieJar } from "tough-cookie";
import * as cheerio from "cheerio";
import type { LoginCredentials, StudentData, CookieData } from "@/types";
import { createLogger } from "@/utils/logger";
import { ServiceUnavailableError, UnauthorizedError } from "@/utils/errors";
import { createAxiosClient } from "@/utils/http/axios-client";
import { API_ENDPOINTS } from "@/constants/api";
import { AuthService } from "./auth.service";
import {
  extractStudentProfile,
  extractPersonalDetails,
  extractContactAddress,
  extractEmergencyContact,
} from "@/utils/extractors/profile-extractor";
import {
  extractEducationBackground,
  extractGPASummary,
  extractAcademicInfo,
} from "@/utils/extractors/academic-extractor";
import {
  extractCourses,
  extractGrades,
  extractSchedule,
  extractFinancialInfo,
  extractTranscript,
  extractFamilyBackground,
  extractProgramPreferences,
  extractRegistrationHistory,
  extractCostSharing,
} from "@/utils/extractors/data-extractor";

export class StudentDataService {
  private readonly authService: AuthService;
  private readonly cookieJar: CookieJar;
  private readonly axiosInstance;
  private readonly logger = createLogger("StudentDataService");

  constructor() {
    this.cookieJar = new CookieJar();
    this.axiosInstance = createAxiosClient(
      API_ENDPOINTS.BASE_URL,
      this.cookieJar
    );
    this.authService = new AuthService(this.axiosInstance);
  }

  /**
   * Scrape student dashboard data
   */
  private async scrapeDashboardData(): Promise<StudentData> {
    try {
      const response = await this.axiosInstance.get(
        API_ENDPOINTS.STUDENT_RECORD
      );
      const $ = cheerio.load(response.data);

      const studentData: StudentData = {
        personalInfo: {
          student_profile: extractStudentProfile($),
          personal_details: extractPersonalDetails($),
          contact_address: extractContactAddress($),
          emergency_contact: extractEmergencyContact($),
          family_background: extractFamilyBackground($),
          education_background: extractEducationBackground($),
          program_preferences: extractProgramPreferences($),
          registration_history: extractRegistrationHistory($),
          cost_sharing: extractCostSharing($),
          gpa_summary: extractGPASummary($),
          academic_info: extractAcademicInfo($),
        },
        academicInfo: extractAcademicInfo($),
        courses: extractCourses($),
        grades: extractGrades($),
        schedule: extractSchedule($),
        financialInfo: extractFinancialInfo($),
        transcript: extractTranscript($),
      };

      return studentData;
    } catch (error) {
      throw new ServiceUnavailableError("Failed to scrape dashboard data");
    }
  }

  /**
   * Main method: Login and scrape all student data
   */
  public async getStudentData(
    credentials: LoginCredentials
  ): Promise<StudentData> {
    try {
      this.logger.info("Starting student data extraction", {
        username: credentials.username,
      });

      // Step 1: Login
      const loginSuccess = await this.authService.login(credentials);
      if (!loginSuccess) {
        throw new UnauthorizedError("Login failed");
      }

      this.logger.info("Login successful, scraping dashboard data");

      // Step 2: Scrape all data
      const studentData = await this.scrapeDashboardData();

      this.logger.info("Successfully extracted student data", {
        username: credentials.username,
        hasPersonalInfo: !!studentData.personalInfo.student_profile.full_name,
        coursesCount: studentData.courses.length,
        gradesCount: studentData.grades.length,
      });

      return studentData;
    } catch (error) {
      this.logger.error("Failed to get student data", {
        username: credentials.username,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  /**
   * Get cookies for debugging
   */
  public async getCookies(): Promise<CookieData[]> {
    const cookies = await this.cookieJar.getCookies("");
    return cookies.map((cookie) => {
      const cookieData: CookieData = {
        name: cookie.key,
        value: cookie.value,
      };

      if (cookie.domain) cookieData.domain = cookie.domain;
      if (cookie.path) cookieData.path = cookie.path;
      if (cookie.expires) cookieData.expires = new Date(cookie.expires);
      if (cookie.maxAge !== "Infinity" && cookie.maxAge !== "-Infinity") {
        cookieData.maxAge = cookie.maxAge as number;
      }
      if (cookie.secure !== undefined) cookieData.secure = cookie.secure;
      if (cookie.httpOnly !== undefined) cookieData.httpOnly = cookie.httpOnly;
      if (cookie.sameSite)
        cookieData.sameSite = cookie.sameSite as "strict" | "lax" | "none";

      return cookieData;
    });
  }
}
