export const API_BASE = "http://10.4.0.147/c/api";
export const API_AUTH = "http://10.4.0.147/c";
export const API_COOKIE_URL = "http://10.4.0.147/c/sanctum/csrf-cookie";

export async function initCSRF() {
  await fetch(API_COOKIE_URL, {
    method: "GET",
    credentials: "include",
  });
}
