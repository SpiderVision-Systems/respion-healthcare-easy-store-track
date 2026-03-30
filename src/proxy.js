import { NextResponse } from 'next/server';

export function proxy(req) {
    const apiKey = req.headers.get('x-api-key'); // Get the API key from headers

    // console.log("Middleware triggered:", req.nextUrl.pathname); // Debugging


    // Bypass middleware for excluded paths
    if (req.nextUrl.pathname.startsWith("/api/photo/")) {
        return NextResponse.next(); // Allow photo API routes without API key check
    }

    if (!apiKey) {
        return new NextResponse(
            JSON.stringify({ error: 'API key is missing' }),
            { status: 400 }
        );
    }

    if (apiKey !== process.env.API_KEY) {
        return new NextResponse(
            JSON.stringify({ error: 'Forbidden: Invalid API key' }),
            { status: 403 }
        );
    }

    return NextResponse.next(); // Proceed to the next middleware or route handler
}

// Config to apply middleware to all API routes
export const config = {
    matcher: '/api/:path*'
};
