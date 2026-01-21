import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export interface ValidatedRequest extends Request {
  validated?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

type ValidateSchema = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validateRequest = (schemas: ValidateSchema) => {
  return async (
    req: ValidatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      req.validated = {};

      if (schemas.body) {
        req.validated.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.params) {
        req.validated.params = await schemas.params.parseAsync(req.params);
      }

      if (schemas.query) {
        req.validated.query = await schemas.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.issues,
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "Validation error",
        error: "Invalid request data",
      });
    }
  };
};
