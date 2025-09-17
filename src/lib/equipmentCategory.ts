import { API_BASE, initCSRF } from "./constants";

type Category = {
  id?: number,
  aname: string,
  lname: string,
  note: string
}

export async function getEquipmentCategories() {
  try {
    const res = await fetch(`${API_BASE}/equipment-categories`, {
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


export async function getEquipmentCategory(categoryId: string | number) {
  try {
    const res = await fetch(`${API_BASE}/equipment-categories/${categoryId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) return {"status": false, "data": "something went wrong"};
    const data = await res.json();
    return {"status": true, "data": data};
  } catch (err) {
    console.error("Get category error:", err);
    return {"status": false, "data": "something went wrong"};
  }
}


export async function createEquipmentCategory(categoryData: Category) {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/equipment-categories`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(categoryData),
    });

    if (!res.ok) {
      // Try to parse validation errors from server
      const errorData = await res.json();
      console.log(errorData)
      return { status: false, data: errorData };
    }
    const data = await res.json();

    return {"status": true, "data": data};
  } catch (err) {
    console.error("Create category error:", err);
    return {"status": false, "data": "something went wrong"};
  }
}


export async function deleteEquipmentCategory(categoryId: string | number) {
  try {
    await initCSRF();

    const res = await fetch(`${API_BASE}/equipment-categories/${categoryId}`, {
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

    return {"status": true, "data": data};
  } catch (err) {
    console.error("Delete category error:", err);
    return {"status": false, "data": "something went wrong"};
  }
}

