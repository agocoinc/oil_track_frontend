import { API_BASE, initCSRF } from "./constants";


interface StructureType {
  tradingName: string;
  organizationChildRelationship?: StructureType[];
}


export interface Company {
  id?: number;
  aname: string;
  lname: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCompanyResponse {
  status: boolean;
  message: string;
  data: Company;
}

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export async function createCompany(
  companyData: Omit<Company, "id" | "created_at" | "updated_at">
): Promise<{ status: boolean; data: CreateCompanyResponse | ValidationErrorResponse }> {
  try {
    // Ensure CSRF token is set if using Sanctum
    await initCSRF();

    const res = await fetch(`${API_BASE}/admin/companies`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(companyData),
    });

    const data = await res.json();

    return { status: res.ok, data };
  } catch (err) {
    console.error("Create company error:", err);
    return {
      status: false,
      data: { message: "حدث خطأ غير متوقع", errors: {} } as ValidationErrorResponse,
    };
  }
}

export async function getCompanies(
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
    const res = await fetch(`${API_BASE}/admin/companies/?${queryParams.toString()}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return {"status": false, "data": "something went wrong"};
    const data = await res.json();
    return {"status": true, "data": data};
  } catch (err) {
    console.error("Get categories error:", err);
    return {"status": false, "data": "something went wrong"};
  }
}

export async function getCompanyStructure(companyId: number | string) {
  try {
    const res = await fetch(`${API_BASE}/companies/${companyId}/structure`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return { status: false, data: "something went wrong" };
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Get company structure error:", err);
    return { status: false, data: "something went wrong" };
  }
}
export async function getCompanyStructureNormal(companyId: number | string) {
  try {
    const res = await fetch(`${API_BASE}/companies/${companyId}/structure`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return { status: false, data: "something went wrong" };
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Get company structure error:", err);
    return { status: false, data: "something went wrong" };
  }
}

export async function storeCompanyStructure(companyId: number | string, structureData: StructureType) {
  try {
    console.log("storeCompanyStructure called with:", { company_id: companyId, structureData });

    const res = await fetch(`${API_BASE}/admin/companies/${companyId}/structure`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        company_id: companyId,
        structure: structureData
      }),
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.log("Error response data:", errorData);
      return { status: false, data: errorData.message || "something went wrong" };
    }

    const data = await res.json();
    console.log("Success response data:", data);
    return { status: true, data };
  } catch (err) {
    console.error("Store company structure error:", err);
    return { status: false, data: "something went wrong" };
  }
}


export async function getCompanyById(id: number) {
  const res = await fetch(`${API_BASE}/admin/companies/${id}`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  const data = await res.json();
  return { status: res.ok, data };
}

export async function updateCompany(id: number, payload: Partial<Company>) {
  await initCSRF();
  const res = await fetch(`${API_BASE}/admin/companies/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return { status: res.ok, data };
}

export async function deleteCompany(id: number) {
  const res = await fetch(`${API_BASE}/admin/companies/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return { status: res.ok };
}
