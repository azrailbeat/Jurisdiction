import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { method = 'GET', headers = {}, body } = options;
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  const isFormData = body instanceof FormData;
  
  // Create request config
  const config: RequestInit = {
    method,
    headers: headers,
    credentials: "include",
  };
  
  // Handle body based on content type
  if (isFormData) {
    // For FormData, browser will set content-type automatically
    config.body = body;
  } else if (body && method !== 'GET') {
    // For JSON data
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json',
    };
    config.body = JSON.stringify(body);
  }
  
  const res = await fetch(url, config);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
