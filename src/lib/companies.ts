import { API_BASE } from "./constants";


interface StructureType {
  tradingName: string;
  organizationChildRelationship?: StructureType[];
}

export async function getCompanies() {
  try {
    const res = await fetch(`${API_BASE}/companies`, {
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

export async function storeCompanyStructure(companyId: number | string, structureData: StructureType) {
  try {
    console.log("storeCompanyStructure called with:", { company_id: companyId, structureData });

    const res = await fetch(`${API_BASE}/companies/${companyId}/structure`, {
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
