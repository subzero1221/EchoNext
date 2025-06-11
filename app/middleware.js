import { NextResponse } from "next/server";

export function middleware(request) {
  // Get the cookie from the request
  const authToken = request.cookies.get("connect.sid")?.value;

  // Attach the cookie to the request headers
  const requestHeaders = new Headers(request.headers);
  if (authToken) {
    requestHeaders.set("connect.sid", authToken);
  }

  // Pass the modified headers to the server component
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
