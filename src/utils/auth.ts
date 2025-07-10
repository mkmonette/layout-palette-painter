export interface AuthData {
  isLoggedIn: boolean;
  username: string;
}

export const loginUser = (username: string, rememberMe: boolean): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("isLoggedIn", "true");
  storage.setItem("username", username);
};

export const registerUser = (username: string, email: string, password: string, rememberMe: boolean): void => {
  // In a real app, you would send this data to your backend
  // For now, we'll just store basic user info and log them in
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("isLoggedIn", "true");
  storage.setItem("username", username);
  storage.setItem("userEmail", email);
};

export const logoutUser = (): void => {
  // Clear from both localStorage and sessionStorage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("username");
  localStorage.removeItem("userEmail");
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("userEmail");
};

export const getCurrentUser = (): AuthData | null => {
  // Check localStorage first, then sessionStorage
  const localLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const sessionLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  
  if (localLoggedIn) {
    return {
      isLoggedIn: true,
      username: localStorage.getItem("username") || "",
    };
  }
  
  if (sessionLoggedIn) {
    return {
      isLoggedIn: true,
      username: sessionStorage.getItem("username") || "",
    };
  }
  
  return null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
