export default function useFileHandler(setAttachedFile) {
  return (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      console.log("📎 添付されたファイル:", file.name);
    }
  };
}
