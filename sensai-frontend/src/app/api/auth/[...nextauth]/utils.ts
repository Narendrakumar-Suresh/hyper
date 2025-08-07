// src/app/api/auth/utils.ts
export async function registerUserWithBackend(user: any, account: any) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_token: account.id_token,     // ← Real JWT from Google
        email: user.email,
        given_name: user.given_name,
        family_name: user.family_name,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend login failed:", errorText);
      return { id: account.sub }; // ← Fallback to sub
    }

    const userData = await response.json();
    console.log("✅ Backend returned user:", userData);
    return userData; // Should have .id = Google sub
  } catch (error) {
    console.error("Error calling backend:", error);
    return { id: account.sub }; // ← Fallback
  }
}