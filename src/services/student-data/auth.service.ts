import { AxiosInstance } from "axios";
import * as cheerio from "cheerio";
import type { LoginCredentials } from "@/types";
import {
  BadRequestError,
  ServiceUnavailableError,
  UnauthorizedError,
} from "@/utils/errors";
import { API_ENDPOINTS } from "@/constants/api";

export class AuthService {
  constructor(private readonly axiosInstance: AxiosInstance) {}

  /**
   * Get CSRF token from login page
   */
  private async getCsrfToken(): Promise<string> {
    try {
      const response = await this.axiosInstance.get(API_ENDPOINTS.LOGIN);
      const $ = cheerio.load(response.data);
      const csrfToken = $('meta[name="csrf-token"]').attr("content");

      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      return csrfToken;
    } catch (error) {
      throw new ServiceUnavailableError("Failed to get CSRF token");
    }
  }

  /**
   * Login to the student portal
   */
  public async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      if (!credentials.username || !credentials.password) {
        throw new BadRequestError("Username and password are required");
      }

      const csrfToken = await this.getCsrfToken();

      // Use URLSearchParams to encode form data
      const formData = new URLSearchParams({
        "user[user_name]": credentials.username,
        "user[password]": credentials.password,
        authenticity_token: csrfToken,
        utf8: "✓",
      });

      await this.axiosInstance.post(API_ENDPOINTS.LOGIN, formData.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRF-Token": csrfToken,
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500,
      });

      // Check if login was successful by trying to access dashboard
      const dashboardResponse = await this.axiosInstance.get(
        API_ENDPOINTS.STUDENT_RECORD
      );
      return (
        dashboardResponse.status === 200 &&
        !dashboardResponse.data.includes("login")
      );
    } catch (error) {
      throw new UnauthorizedError("Login failed - invalid credentials");
    }
  }
}
