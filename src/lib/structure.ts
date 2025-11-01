import { API_BASE, initCSRF } from "./constants";

export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}


export interface ManagementStructureNode {
  id: number;
  parent_id?: number | null;
  name: string;
  manager_name?: string | null;
  manager_photo?: string | null;
  category: string;
}

export interface ManagementStructureNodeChild {
  id: number;
  parent_id?: number | null;
  name: string;
  manager_name?: string | null;
  manager_photo?: string | null;
  category: string;
  children?: ManagementStructureNodeChild[]; 
}

export interface ManagementStructureResponse {
  status: boolean;
  message: string;
  data: ManagementStructureNode[];
}

/**
 * Fetch public management structure nodes for a company
 */
export async function fetchPublicManagement(companyId: number): Promise<ManagementStructureResponse> {
  try {
    const res = await fetch(`${API_BASE}/companies/${companyId}/public-management`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      credentials: "include", // include auth cookies if needed
    });

    const data = await res.json();

    return data as ManagementStructureResponse;
  } catch (error) {
    console.error("Error fetching public management structure:", error);
    return {
      status: false,
      message: "فشل في جلب بيانات الهيكل العام",
      data: [],
    };
  }
}

export async function fetchCompanyStructure(companyId: number) {
  await initCSRF();
  const res = await fetch(`${API_BASE}/companies/${companyId}/structure`, {
    credentials: "include",
  });
  const data = await res.json();
  return { status: res.ok, data: data.data };
}
export async function fetchNodeWithChildren(nodeId: number) {
  await initCSRF();
  const res = await fetch(`${API_BASE}/companies/structure/node/${nodeId}`, {
    credentials: "include",
  });
  const data = await res.json();
  return { status: res.ok, data: data.data };
}

// export async function fetchNodeWithChildren(nodeId: number) {
//   try {
//     const res = await fetch(`/api/companies/structure/node/${nodeId}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! Status: ${res.status}`);
//     }

//     const data = await res.json();
//     return data; // { status: true, message: "...", data: { id, children: [...] } }
//   } catch (error) {
//     console.error("Error fetching node with children:", error);
//     return {
//       status: false,
//       message: "فشل في جلب بيانات العنصر مع التفرعات",
//       data: null,
//     };
//   }
// }


export async function createStructureNode(companyId: number, nodeData: FormData) {
  await initCSRF();
  const res = await fetch(`${API_BASE}/companies/${companyId}/structure`, {
    method: "POST",
    credentials: "include",
    // headers: { "Content-Type": "application/json" },
    body: nodeData,
  });
  const data = await res.json();
  return { status: res.ok, data };
}

export async function deleteStructureNode(companyId: number, nodeId: number) {
  await initCSRF();
  const res = await fetch(`${API_BASE}/companies/${companyId}/structure/${nodeId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await res.json();
  return { status: res.ok, data };
}
