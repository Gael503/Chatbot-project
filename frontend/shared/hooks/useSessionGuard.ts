"use client";

import { useEffect, useRef } from "react";
import { authService } from "@/services/auth/auth.service";

const CHECK_INTERVAL = 60 * 1000; // 1 minute

export function useSessionGuard() {
    const isChecking = useRef(false);

    useEffect(() => {
        const checkSession = async () => {
            if (isChecking.current) return;
            isChecking.current = true;
            try {
                const session = await authService.getCurrentSession();
                if (!session) {
                    await authService.logout();
                }
            } finally {
                isChecking.current = false;
            }
        };

        checkSession();
        const interval = setInterval(checkSession, CHECK_INTERVAL);
        document.addEventListener("visibilitychange", checkSession);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", checkSession);
        };
    }, []);
}
