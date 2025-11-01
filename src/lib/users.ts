import { API_BASE, initCSRF } from "./constants";

// ----------------------- Types -----------------------
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  company_id: number | null;
  role: "admin" | "user";
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserResponse {
  status: boolean;
  message: string;
  data: User;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

// ----------------------- API Calls -----------------------
export async function getUsers(
  perPage: number = 20,
  page: number = 1,
  search: string = ""
) {
  try {
    await initCSRF();

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
    });
    if (search) queryParams.append("search", search);

    const res = await fetch(`${API_BASE}/admin/users?${queryParams.toString()}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return { status: false, data: "Something went wrong" };
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Get users error:", err);
    return { status: false, data: "Something went wrong" };
  }
}

export async function createUser(
  userData: Omit<User, "id" | "created_at" | "updated_at">
): Promise<{ status: boolean; data: User | ValidationErrorResponse }> {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/admin/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Create user error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

// Optionally add update, delete, show...
export async function updateUser(
  userId: number,
  userData: Partial<Omit<User, "id" | "created_at" | "updated_at">>
) {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Update user error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

export async function deleteUser(userId: number) {
  try {
    const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return { status: res.ok };
  } catch (err) {
    console.error("Delete user error:", err);
    return { status: false };
  }
}


export async function getUserById(id: number) {
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  return { status: res.ok, data };;
}