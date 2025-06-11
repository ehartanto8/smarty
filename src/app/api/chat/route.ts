import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { message } = await req.json();

  const prompt = `You are Smarty, an IT helpdesk assistant that triages user questions step by step. Be friendly, ask clarifying questions if needed, and walk the user through resolution. Only escalate if necessary.\n\nUser: ${message}\nSmarty:`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Smarty, an internal IT helpdesk assistant. Respond helpfully, clearly, and in a step-by-step format.

          Use:
          - Bullet points
          - Numbered lists
          - Short paragraphs

          Always format your response to be easy to read. Markdown is supported.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.4
    })
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t come up with a response.";

  return NextResponse.json({ reply });
}
