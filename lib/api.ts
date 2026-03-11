/**
 * API utility functions for consistent error handling and requests
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export interface ApiError {
  error: string;
  status?: number;
}

/**
 * Handle API response with error checking
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: `HTTP error! status: ${response.status}`,
    }));
    error.status = response.status;
    throw error;
  }
  return response.json();
}

/**
 * GET request helper
 */
export async function apiGet<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return handleResponse<T>(response);
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(response);
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: any,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return handleResponse<T>(response);
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return handleResponse<T>(response);
}

/**
 * Upload file helper
 */
export async function apiUpload<T>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });
  return handleResponse<T>(response);
}

