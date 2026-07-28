"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import { getCurrentUser } from "@/services/authService";

interface User {

    id: number;

    username: string;

    email: string;

    role: string;

    is_superuser?: boolean;

    groups?: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<
    AuthContextType | undefined
>(undefined);

export function AuthProvider({

    children,

}: {

    children: ReactNode;

}) {

    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    async function refreshUser() {

    const token =
        localStorage.getItem("access");

    console.log("========== AUTH ==========");
    console.log("Access Token:", token);

    if (!token) {

        console.log("No token found.");

        setUser(null);

        setLoading(false);

        return;

    }

    try {

        console.log(
            "Calling /accounts/me/..."
        );

        const me =
            await getCurrentUser();

        console.log("AUTH SUCCESS");

        console.log(me);

        setUser(me);

    } catch (error: any) {

        console.error("AUTH FAILED");

        console.error(error);

        console.error(
            "Status:",
            error?.response?.status
        );

        console.error(
            "Data:",
            error?.response?.data
        );

        // TEMPORARY:
        // Keep the tokens while we diagnose the issue.

        setUser(null);

    } finally {

        setLoading(false);

        console.log("=========================");

    }

}

    useEffect(() => {

        refreshUser();

    }, []);

    function logout() {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        sessionStorage.clear();

        setUser(null);

        window.location.replace("/login");

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logout,
                setUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;

}