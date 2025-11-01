import { API_BASE, initCSRF } from "./constants";

type Detail = {
  id?: number,
  equipment_category_id: number | string,
  loc_name: string,
  details_aname: string,
  details_lname: string,
  details_qty: number,
  date_from: string,
  date_to: string,
  note: string
}

export async function getEquipmentDetailsByCategory(categoryId: string | number) {
  try {
    const res = await fetch(`${API_BASE}/equipment-details/${categoryId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return { status: false, data: "something went wrong" };
    const data = await res.json();

    return { status: true, data };
  } catch (err) {
    console.error("Get equipment details error:", err);
    return { status: false, data: "something went wrong" };
  }
}

export async function getEquipmentDetail(detailId: string | number) {
  try {
    const res = await fetch(`${API_BASE}/equipment-detail/${detailId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data)
      return { status: false, data: "something went wrong" }
    };
    const data = await res.json();

    return { status: true, data };
  } catch (err) {
    
    console.error("Get equipment detail error:", err);
    return { status: false, data: "something went wrong" };
  }
}

export async function createEquipmentDetail(detailData: Detail) {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/equipment-details`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(detailData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      return { status: false, data: errorData };
    }

    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    console.error("Create equipment detail error:", err);
    return { status: false, data: "something went wrong" };
  }
}

export async function deleteEquipmentDetail(detailId: string | number) {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/equipment-details/${detailId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      return { status: false, data: errorData };
    }

    const data = await res.json();
    return { status: true, data };
  } catch {
    console.error("Delete equipment detail error:");
    return { status: false, data: "something went wrong" };
  }
}

export async function getEquipmentDetailStats() {
  try {
    const res = await fetch(`${API_BASE}/stats/category-items/`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data)
      return { status: false, data: "something went wrong" }
    };
    const data = await res.json();

    return { status: true, data };
  } catch (err) {
    
    console.error("Get equipment detail error:", err);
    return { status: false, data: "something went wrong" };
  }
}


export async function getEquipmentDetailStatsForAdmin() {
  try {
    const res = await fetch(`${API_BASE}/admin/stats/category-items/`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const data = await res.json();
      console.log(data)
      return { status: false, data: "something went wrong" }
    };
    const data = await res.json();

    return { status: true, data };
  } catch (err) {
    
    console.error("Get equipment detail error:", err);
    return { status: false, data: err };
  }
}
