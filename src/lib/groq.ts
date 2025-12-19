import Groq from "groq-sdk";

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export async function generateWithGroq(
  prompt: string,
  model: string = "llama-3.1-8b-instant"
): Promise<string> {
  if (!groq) {
    throw new Error("GROQ_API_KEY not configured");
  }

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Du är en SEO-expert som ger konkreta, actionbara förslag på svenska.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return completion.choices[0]?.message?.content || "";
}

export function isGroqAvailable(): boolean {
  return !!process.env.GROQ_API_KEY;
}
