export async function callStreamingAPI(baseURL, apiKey, contextMessages) {
  const res = await fetch(`${baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: contextMessages,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const errorText = await res.text();
    throw new Error(`APIエラー: ${res.status} ${errorText}`);
  }

  return res.body.getReader();
}
