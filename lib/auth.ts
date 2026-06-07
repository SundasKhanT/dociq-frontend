export const saveToken = (token: string) =>
  localStorage.setItem("access_token", token);

export const getToken = () => localStorage.getItem("access_token");

export const clearToken = () => localStorage.removeItem("access_token");

export const isLoggedIn = () => !!getToken();
