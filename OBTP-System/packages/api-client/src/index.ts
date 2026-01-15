import { HttpClient } from "./core/http-client";
import { AuthApi } from "./modules/auth";

export * from "./core/http-client";
export * from "./modules/auth";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
}

export class ApiClient {
  public http: HttpClient;
  public auth: AuthApi;

  constructor(config: ApiClientConfig) {
    if (!config.baseURL) {
      throw new Error("ApiClient: baseURL is required in configuration.");
    }
    
    this.http = new HttpClient(config.baseURL);
    this.auth = new AuthApi(this.http);
  }

  // Tiện ích để set Token từ tầng Application
  setToken(token: string) {
    this.http.setAccessToken(token);
  }

  clearToken() {
    this.http.clearAccessToken();
  }
}

