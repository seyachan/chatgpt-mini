export function formatFileMessage(file) {
  if (!file || typeof window === "undefined") return null;

  const fileUrl = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    return `<img src="${fileUrl}" alt="アップロード画像" />`;
  } else if (file.type.startsWith("audio/")) {
    return `<audio controls src="${fileUrl}"></audio>`;
  } else {
    return `📎 添付ファイル: ${file.name}`;
  }
}
