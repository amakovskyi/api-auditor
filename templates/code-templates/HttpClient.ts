import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface HttpClientOptions {
  baseURL?: string;
}

export class HttpClient {
  private readonly baseURL?: string;

  constructor(options?: HttpClientOptions) {
    this.baseURL = options?.baseURL;
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    console.log('Request:');
    console.log('Method:', config.method);
    console.log('URL:', config.baseURL ? `${config.baseURL}${config.url}` : config.url);
    console.log('Parameters:', config.params);
    console.log('Headers:', config.headers);
    console.log('Body:', config.data);

    try {
      const response: AxiosResponse<T> = await axios.request<T>(config);

      console.log('Response:');
      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      console.log('Data:', response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        console.error('Error Response:');
        console.error('Status:', axiosError.response?.status);
        console.error('Status Text:', axiosError.response?.statusText);
        console.error('Headers:', axiosError.response?.headers);
        console.error('Data:', axiosError.response?.data);
      }
      throw error;
    }
  }

  public async get<T>(url: string, params?: any, headers?: any): Promise<T> {
    return this.request<T>({
      method: 'GET',
      baseURL: this.baseURL,
      url,
      params,
      headers,
    });
  }

  public async post<T>(url: string, data?: any, headers?: any): Promise<T> {
    return this.request<T>({
      method: 'POST',
      baseURL: this.baseURL,
      url,
      data,
      headers,
    });
  }

  public async put<T>(url: string, data?: any, headers?: any): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      baseURL: this.baseURL,
      url,
      data,
      headers,
    });
  }

  public async delete<T>(url: string, params?: any, headers?: any): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      baseURL: this.baseURL,
      url,
      params,
      headers,
    });
  }
}