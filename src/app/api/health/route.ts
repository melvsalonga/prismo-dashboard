import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db-utils";

export async function GET() {
  try {
    const dbHealthy = await checkDatabaseConnection();
    
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      services: {
        database: dbHealthy ? "healthy" : "unhealthy",
        api: "healthy",
      },
    };

    return NextResponse.json(health, {
      status: dbHealthy ? 200 : 503,
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        services: {
          database: "unhealthy",
          api: "healthy",
        },
        error: "Health check failed",
      },
      { status: 503 }
    );
  }
}