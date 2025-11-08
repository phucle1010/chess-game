export async function GET() {
  return new Response(
    JSON.stringify({ message: "Socket.io server endpoint" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
