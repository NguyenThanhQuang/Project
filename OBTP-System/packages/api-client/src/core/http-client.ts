import { ApiErrorResponse } from "@obtp/shared-types";
import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

// Helper check lỗi chuẩn từ backend trả về
function isApiError(data: unknown): data is ApiErrorResponse {
  return typeof data === "object" && data !== null && "errorCode" in data;
}

export class HttpClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this._initializeRequestInterceptor();
    this._initializeResponseInterceptor();
  }

  // --- Token Management ---
  public setAccessToken(token: string) {
    this.token = token;
  }

  public clearAccessToken() {
    this.token = null;
  }

  private _initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );
  }

  private _initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Trả về nguyên raw data body, bỏ qua headers/config
        return response.data;
      },
      (error: AxiosError) => {
        // Standardize Error
        const originalError = error.response?.data;
        const statusCode = error.response?.status || 500;

        let standardError: ApiErrorResponse = {
          statusCode,
          message: "Lỗi kết nối máy chủ",
          errorCode: "ERR_NETWORK",
          path: error.config?.url || "unknown",
          timestamp: new Date().toISOString(),
        };

        if (isApiError(originalError)) {
          standardError = originalError;
        } else if (typeof originalError === 'object' && originalError && 'message' in originalError) {
             // Fallback cho các lỗi chưa đúng format chuẩn 100% nhưng có message
             standardError.message = (originalError as any).message;
             standardError.errorCode = (originalError as any).error || "ERR_UNKNOWN";
        }

        return Promise.reject(standardError);
      }
    );
  }

  // --- Generic HTTP Methods ---
  // T: Response Data Type
  // D: Payload Data Type
  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<T, T>(url, config);
  }

  public post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<T, T>(url, data, config);
  }

  public put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<T, T>(url, data, config);
  }

  public patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<T, T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<T, T>(url, config);
  }
}