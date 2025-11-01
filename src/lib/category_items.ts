import { API_BASE, initCSRF } from "./constants";

export interface CategoryItem {
  id?: number;
  category_id: number;
  company_id: number;
  loc_name?: string;
  aname?: string;
  lname?: string;
  qty?: number;
  from?: string;
  to?: string;
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryItemResponse {
  status: boolean;
  message: string;
  data: CategoryItem;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

/**
 * Create a new category item
 */
export async function createCategoryItem(
  itemData: Omit<CategoryItem, "id" | "created_at" | "updated_at">
): Promise<{ status: boolean; data: CreateCategoryItemResponse | ValidationErrorResponse }> {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/category-items`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(itemData),
    });

    const data = await res.json();
    console.log("createCategoryItem response data:", data);
    return { status: res.ok, data };
  } catch (err) {
    console.error("Create category item error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

/**
 * Get category items for a specific company and category
 */
export async function getCategoryItemsNormal(companyId: number, categoryId: number, perPage: number = 20,
  page: number = 1,
  search: string = "") {
  try {
    await initCSRF();

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
    });
    if (search) queryParams.append("search", search);
    const res = await fetch(`${API_BASE}/companies/${companyId}/categories/${categoryId}/items?${queryParams.toString()}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return { status: false, data: "something went wrong" };
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Get category items error:", err);
    return { status: false, data: "something went wrong" };
  }
}

export async function getCategoryItems(companyId: number, categoryId: number, perPage: number = 20,
  page: number = 1,
  search: string = "") {
  try {
    await initCSRF();

    const queryParams = new URLSearchParams({
      per_page: perPage.toString(),
      page: page.toString(),
    });
    if (search) queryParams.append("search", search);
    const res = await fetch(`${API_BASE}/admin/companies/${companyId}/categories/${categoryId}/items?${queryParams.toString()}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return { status: false, data: "something went wrong" };
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Get category items error:", err);
    return { status: false, data: "something went wrong" };
  }
}

/**
 * Get a single category item by ID
 */
export async function getCategoryItemById(id: number) {
  try {
    const res = await fetch(`${API_BASE}/category-items/${id}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Get category item by id error:", err);
    return { status: false, data: "something went wrong" };
  }
}

/**
 * Update a category item
 */
export async function updateCategoryItem(id: number, payload: Partial<CategoryItem>) {
  try {
    await initCSRF();
    const res = await fetch(`${API_BASE}/category-items/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return { status: res.ok, data };
  } catch (err) {
    console.error("Update category item error:", err);
    return { status: false, data: "something went wrong" };
  }
}

/**
 * Delete a category item
 */
export async function deleteCategoryItemNormal(id: number) {
  try {
    const res = await fetch(`${API_BASE}/category-items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return { status: res.ok };
  } catch (err) {
    console.error("Delete category item error:", err);
    return { status: false };
  }
}
