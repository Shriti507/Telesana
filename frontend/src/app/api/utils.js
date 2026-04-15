export const API_URL = process.env.NEXT_PUBLIC_BACKEND_API;

export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    credentials: "include",
  });
  return res.json();
}

export async function apiPost(path, data) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
