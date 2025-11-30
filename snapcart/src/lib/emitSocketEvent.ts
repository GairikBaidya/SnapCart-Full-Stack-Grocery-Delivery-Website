export async function emitSocketEvent(event: string, data: any, socketId?: string) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data, socketId }),
    });
  } catch (err) {
    console.log("Socket Notify Error:", err);
  }
}
