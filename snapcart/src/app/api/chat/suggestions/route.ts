import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { conversation } = await req.json();

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" +
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a professional delivery assistant chatbot.

Analyze the last user message and generate 3 short, polite WhatsApp-style reply suggestions
that a delivery boy could send to a customer.

⚠️ Follow these rules:
- Reply context must match the user's last message.
- Keep replies short, natural, human-like (max 10 words).
- Use emojis properly (but not too many, max one per reply).
- No generic replies like "Okay, sure" or "Thank you".
- Replies must be helpful, respectful, and specific to delivery/status/help/location.
- NO numbering, NO extra text, just replies separated by commas.

Messages:
${conversation}

Return only comma-separated reply suggestions.`
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await res.json();
    console.log(data)
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const suggestions = replyText
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s.length);

    return NextResponse.json({ success: true, suggestions });
    
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
