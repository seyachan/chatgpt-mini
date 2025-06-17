export async function readStreamChunks(reader, onChunk, onDone) {
  const decoder = new TextDecoder("utf-8");
  let result = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk
      .split("\n")
      .filter((line) => line.trim().startsWith("data:"));

    for (const line of lines) {
      const json = line.replace(/^data:\s*/, "");
      if (json === "[DONE]") {
        onDone(result);
        return;
      }

      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (typeof content === "string") {
          result += content;
          onChunk(result);
        }
      } catch (err) {
        console.error("❌ JSON parse error:", json, err);
      }
    }
  }

  onDone(result);
}
