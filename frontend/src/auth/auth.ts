// auth.ts
export const saveToken = (token: string) => {
  localStorage.setItem("jwt", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("jwt");
};

export const removeToken = () => localStorage.removeItem("jwt");
