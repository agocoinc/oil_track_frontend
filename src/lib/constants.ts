export const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;
export const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH!;
export const API_COOKIE_URL = process.env.NEXT_PUBLIC_API_COOKIE_URL!;

export async function initCSRF() {
  await fetch(API_COOKIE_URL, {
    method: "GET",
    credentials: "include",
  });
}
