export function getAuth() {
    if (typeof window === "undefined") return null
    try {
        const raw = window.localStorage.getItem("auth")
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function setAuth(auth) {
    if (typeof window === "undefined") return
    window.localStorage.setItem("auth", JSON.stringify(auth))
    window.dispatchEvent(new Event("auth-changed"))
}

export function clearAuth() {
    if (typeof window === "undefined") return
    window.localStorage.removeItem("auth")
    window.dispatchEvent(new Event("auth-changed"))
}

export function isLoggedIn() {
    const auth = getAuth()
    return !!auth && !!auth.user && !!auth.role
}

export function getRole() {
    const auth = getAuth()
    return auth?.role || null
}

export function hasRole(role) {
    return getRole() === role
}

export function deriveRoleFromUsername(username) {
    const listRaw = process.env.NEXT_PUBLIC_ADMIN_USERS || "admin"
    const allow = listRaw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    if (!username) return "user"
    return allow.includes(String(username).toLowerCase()) ? "admin" : "user"
}
