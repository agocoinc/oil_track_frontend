import { API_AUTH, API_BASE, API_COOKIE_URL } from "./constants";

export async function login(email: string, password:string) {
  try {
    await fetch(`${API_COOKIE_URL}`, {
      method: "GET",
      credentials: "include"
    });
    const res = await fetch(`${API_AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });


    

    if (!res.ok) {
      // Try to parse validation errors from server
      const errorData = await res.json();
      return { status: false, data: errorData };
    }

    const data = await res.json();

    return {"status": true, "data": data};
  } catch (err) {
    return {"status": true, "error": "something went wrong"};
  }
}

export async function logout() {
  try {
    await fetch(`${API_AUTH}/logout`, {
      method: "POST",
      credentials: "include",
    });
  
    window.location.href = "/login";
  }catch(error) {
    console.log(error)
  }
}


export async function checkAuth() {
  try {
    const res = await fetch(`${API_AUTH}/api/me`, {
      method: "GET",
      headers: {Accept: "application/json"},
      credentials: "include",
    });

    if (!res.ok) {
      console.log("Response error status:", res.status, res.statusText);
      const errorBody = await res.text(); // Or res.json() if JSON expected
      console.log("Error response body:", errorBody);
      return null;
    }

    const data = await res.json();
    console.log("Success response data:", data);
    return data;
  } catch (err) {
    console.log("this is the error =>", err);
    return null;
  }
}
