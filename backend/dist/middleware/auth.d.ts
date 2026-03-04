import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    userId?: string;
    userEmail?: string;
}
export declare function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=auth.d.ts.map