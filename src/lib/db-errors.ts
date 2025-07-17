import { Prisma } from "@prisma/client";

export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export function handleDatabaseError(error: unknown): DatabaseError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return new DatabaseError(
          "A record with this information already exists",
          "UNIQUE_CONSTRAINT_VIOLATION",
          error
        );
      case "P2025":
        return new DatabaseError(
          "Record not found",
          "RECORD_NOT_FOUND",
          error
        );
      case "P2003":
        return new DatabaseError(
          "Foreign key constraint failed",
          "FOREIGN_KEY_CONSTRAINT",
          error
        );
      case "P2014":
        return new DatabaseError(
          "Invalid ID provided",
          "INVALID_ID",
          error
        );
      default:
        return new DatabaseError(
          "Database operation failed",
          error.code,
          error
        );
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new DatabaseError(
      "Unknown database error occurred",
      "UNKNOWN_ERROR",
      error
    );
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new DatabaseError(
      "Database engine error",
      "ENGINE_ERROR",
      error
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError(
      "Failed to connect to database",
      "CONNECTION_ERROR",
      error
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new DatabaseError(
      "Invalid data provided",
      "VALIDATION_ERROR",
      error
    );
  }

  return new DatabaseError(
    "An unexpected error occurred",
    "UNEXPECTED_ERROR",
    error
  );
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw handleDatabaseError(error);
  }
}