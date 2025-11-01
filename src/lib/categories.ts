import { API_BASE, initCSRF } from "./constants";

export interface Category {
  id?: number;
  parent_id?: number;
  aname: string;
  lname: string;
  note?: string;
  children?: Category[]
  fields: string[];
  created_at?: string;
  updated_at?: string;
}

// Laravel success structure
export interface CategoryListResponse {
  status: boolean;
  message: string;
  data: Category[];
}

// Validation error structure
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  status: boolean;
  data: T;
}

export interface CreateCategoryResponse {
  status: boolean;
  message: string;
  data: Category;
}

// ✅ Create category
export async function editCategory(
    categoryId: number,
  categoryData: Omit<Category, "id">
): Promise<ApiResponse<CreateCategoryResponse | ValidationErrorResponse>> {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/admin/categories/${categoryId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Create category error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}
export async function createCategory(
  categoryData: Omit<Category, "id">
): Promise<ApiResponse<CreateCategoryResponse | ValidationErrorResponse>> {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Create category error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

export async function fetchCategories(
  perPage: number = 20,
  page: number = 1,
  search: string = ""
): Promise<ApiResponse<CategoryListResponse | ValidationErrorResponse>> {
  try {
    await initCSRF();

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
    });
    if (search) queryParams.append("search", search);

    const res = await fetch(`${API_BASE}/admin/categories?${queryParams.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Fetch categories error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

export async function fetchCategoriesNormal(
  perPage: number = 20,
  page: number = 1,
  search: string = ""
): Promise<ApiResponse<CategoryListResponse | ValidationErrorResponse>> {
  try {
    await initCSRF();

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
    });
    if (search) queryParams.append("search", search);

    const res = await fetch(`${API_BASE}/categories?${queryParams.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Fetch categories error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

// ✅ Get single category by ID
export async function getCategoryById(id: number): Promise<ApiResponse<{ data: Category }>> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Get category error:", err);
    return { status: false, data: { data: null } as any };
  }
}
export async function getCategoryByIdNormal(id: number): Promise<ApiResponse<{ data: Category }>> {
  try {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Get category error:", err);
    return { status: false, data: { data: null } as any };
  }
}

// ✅ Get subcategories of a category
export async function getSubCategories(
  parentId: number
): Promise<ApiResponse<{ data: Category[] }>> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${parentId}/children`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { status: res.ok, data };
  } catch {
    return { status: false, data: { data: [] } as any };
  }
}

// ✅ Delete a category
export async function deleteCategory(
  id: number
): Promise<ApiResponse<any>> {
  try {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { status: res.ok, data };
  } catch {
    return { status: false, data: { message: "خطأ في الحذف" } as any };
  }
}

