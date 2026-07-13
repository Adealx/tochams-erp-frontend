"use client";

import { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";

interface Props {

    roles: string[];

    children: ReactNode;
}

export default function RoleGuard({

    roles,

    children,

}: Props) {

    const { user, loading } = useAuth();

    if (loading) {

        return null;
    }

    if (!user) {

        return null;
    }

    if (!roles.includes(user.role)) {

        return null;
    }

    return <>{children}</>;
}