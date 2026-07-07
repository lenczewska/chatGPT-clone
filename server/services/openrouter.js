import fetch from "node-fetch";

export async function askOpenRouter(message) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openrouter/free",
      messages: [{ role: "user", content: message }],
    }),
  });

  const data = await response.json().catch((err) => {
    throw new Error(`Invalid response from OpenRouter: ${err.message}`);
  });

  if (!response.ok) {
    const serverError = data?.error || data?.message || "OpenRouter returned an error";
    const error = new Error(serverError);
    error.status = response.status;
    throw error;
  }

  const answer = data?.choices?.[0]?.message?.content;

  if (!answer) {
    throw new Error("OpenRouter returned an empty answer");
  }

  return answer;
}
