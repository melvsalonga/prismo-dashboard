import { db } from "./db";
import { withErrorHandling } from "./db-errors";

// Database health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

// Transaction wrapper
export async function withTransaction<T>(
  operation: (tx: Omit<typeof db, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
): Promise<T> {
  return withErrorHandling(async () => {
    return await db.$transaction(operation);
  });
}

// Pagination utilities
export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(options: PaginationOptions) {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 10));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Search utilities
export function createSearchFilter(searchTerm?: string, fields: string[] = []) {
  if (!searchTerm || fields.length === 0) {
    return {};
  }

  return {
    OR: fields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: "insensitive" as const,
      },
    })),
  };
}

// Date range utilities
export interface DateRangeFilter {
  from?: Date;
  to?: Date;
}

export function createDateRangeFilter(
  field: string,
  dateRange?: DateRangeFilter
) {
  if (!dateRange) {
    return {};
  }

  const filter: Record<string, unknown> = {};

  if (dateRange.from || dateRange.to) {
    filter[field] = {};
    
    if (dateRange.from) {
      (filter[field] as Record<string, unknown>).gte = dateRange.from;
    }
    
    if (dateRange.to) {
      (filter[field] as Record<string, unknown>).lte = dateRange.to;
    }
  }

  return filter;
}

// Soft delete utilities (for future use)
export function excludeDeleted() {
  return {
    deletedAt: null,
  };
}

// Common query options
export interface QueryOptions extends PaginationOptions {
  search?: string;
  searchFields?: string[];
  dateRange?: DateRangeFilter;
  dateField?: string;
  include?: Record<string, unknown>;
  where?: Record<string, unknown>;
}

// Generic repository base class
export abstract class BaseRepository<T> {
  protected abstract model: {
    findUnique: (args: unknown) => Promise<T | null>;
    findMany: (args: unknown) => Promise<T[]>;
    count: (args: unknown) => Promise<number>;
    create: (args: unknown) => Promise<T>;
    update: (args: unknown) => Promise<T>;
    delete: (args: unknown) => Promise<T>;
  };

  async findById(id: string, include?: Record<string, unknown>): Promise<T | null> {
    return withErrorHandling(async () => {
      return await this.model.findUnique({
        where: { id },
        include,
      });
    });
  }

  async findMany(options: QueryOptions = {}): Promise<PaginatedResult<T>> {
    return withErrorHandling(async () => {
      const { page, limit, skip, take } = getPaginationParams(options);
      
      const where = {
        ...options.where,
        ...createSearchFilter(options.search, options.searchFields),
        ...createDateRangeFilter(options.dateField || "createdAt", options.dateRange),
      };

      const orderBy = options.orderBy
        ? { [options.orderBy]: options.orderDirection || "desc" }
        : { createdAt: "desc" };

      const [data, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take,
          orderBy,
          include: options.include,
        }),
        this.model.count({ where }),
      ]);

      return createPaginatedResult(data, total, page, limit);
    });
  }

  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    return withErrorHandling(async () => {
      return await this.model.create({ data });
    });
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return withErrorHandling(async () => {
      return await this.model.update({
        where: { id },
        data,
      });
    });
  }

  async delete(id: string): Promise<T> {
    return withErrorHandling(async () => {
      return await this.model.delete({
        where: { id },
      });
    });
  }

  async exists(id: string): Promise<boolean> {
    return withErrorHandling(async () => {
      const count = await this.model.count({
        where: { id },
      });
      return count > 0;
    });
  }
}