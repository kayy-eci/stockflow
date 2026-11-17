import type { Request, Response, NextFunction } from "express";

export function staffMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    if (!user) {
        res.status(401).json({ message: "Token tidak valid" });
        return;
    }

    if (user.role !== "staff") {
        res.status(403).json({ message: "Hanya staff yang boleh akses ini" });
        return;
    }

    next();
}
