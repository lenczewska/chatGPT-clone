import fetch from "node-fetch";

export async function askOpenRouter(message) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openrouter/free", // только бесплатные модели
      messages: [{ role: "user", content: message }]
    })
  });

  const data = await response.json();
  return data.choices[0].message;
}
