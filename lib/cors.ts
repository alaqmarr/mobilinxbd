import { NextResponse } from "next/server";

const allowedOrigins = [
  "https://mobifront.vercel.app",
  "http://localhost:3000",
  "*"
];

export function withCors(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const origin = req.headers.get("origin") || "";
    const res = await handler(req, ...args);

    // Clone the response to modify headers
    const response = NextResponse.next();
    Object.entries(res.headers || {}).forEach(([key, value]) =>
      response.headers.set(key, value as string)
    );

    // Always allow JSON
    response.headers.set("Content-Type", "application/json");

    // Allow CORS
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    // Handle OPTIONS preflight
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: response.headers });
    }

    return res;
  };
}
