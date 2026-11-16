import type { NextFunction, Request, Response } from "express";
import { Jwt } from "jsonwebtoken";



const SECRET = process.env.JWT_SECRET;

export const  tokenMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split('')[1];

    if (!token) {
        res.status(404).json({
            message: "Unauthorized. No token Provided"
        })
    }


    try {
        const payload = jwt.verify(token, SECRET) as UserTokenPayload;
    } catch () {
        
    }
}
