import { toast } from "sonner";

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = "An error occurred";
  let errorTitle = "Error";

  try {
    const errorData: ApiError = await response.json();
    errorMessage = errorData.error || errorData.message || errorMessage;
  } catch {
    // If response is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }

  // Set error title based on status code
  switch (response.status) {
    case 400:
      errorTitle = "Bad Request";
      break;
    case 401:
      errorTitle = "Unauthorized";
      errorMessage = "Please login to continue";
      // Redirect to login page for unauthorized errors
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith("/auth")) {
          window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
      break;
    case 403:
      errorTitle = "Forbidden";
      errorMessage = "You don't have permission to perform this action";
      break;
    case 404:
      errorTitle = "Not Found";
      errorMessage = "The requested resource was not found";
      break;
    case 500:
      errorTitle = "Server Error";
      errorMessage = "A server error occurred. Please try again later";
      break;
    case 503:
      errorTitle = "Service Unavailable";
      errorMessage = "The service is temporarily unavailable";
      break;
    default:
      errorTitle = "Error";
  }

  // Show toast notification
  toast.error(errorTitle, {
    description: errorMessage,
  });

  // Throw error with message for React Query
  throw new Error(errorMessage);
}

export async function fetchWithErrorHandling(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);

  if (!response.ok) {
    await handleApiError(response);
  }

  return response;
}
