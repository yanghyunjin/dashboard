// utils/cookieHelper.ts

const LOGIN_COOKIE_KEY = "loginStatus";

export function setLoginStatus(value: string, days: number = 7) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const expires = `expires=${expirationDate.toUTCString()}`;
  document.cookie = `${LOGIN_COOKIE_KEY}=${value}; ${expires}; path=/`;
}

export function getLoginStatus(): string | null {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === LOGIN_COOKIE_KEY) {
        return value;
      }
    }
    return null;
  }

  return null;
}

export function removeLoginStatus() {
  document.cookie = `${LOGIN_COOKIE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
