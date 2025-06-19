import axios, { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import { getRequestTimeout, getUserAgent } from "@/config";

export const createAxiosClient = (
  baseUrl: string,
  cookieJar: CookieJar
): AxiosInstance => {
  return wrapper(
    axios.create({
      baseURL: baseUrl,
      timeout: getRequestTimeout(),
      jar: cookieJar,
      headers: {
        "User-Agent": getUserAgent(),
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
    })
  );
};
