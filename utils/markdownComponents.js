const markdownComponents = {
  p: ({ children }) => <p className="leading-relaxed mb-3">{children}</p>,

  code: ({ children }) => (
    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),

  pre: ({ children }) => {
    const extractText = (node) => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (typeof node === "object" && node?.props?.children)
        return extractText(node.props.children);
      return "";
    };

    const text = extractText(children).trim();

    const copyToClipboard = () => {
  if (text) {
    navigator.clipboard.writeText(text)
      .then(() => alert("✅ コピーしました:\n\n" + text))
      .catch((err) => alert("⚠️ コピーに失敗しました\n" + err));
  } else {
    alert("⚠️ コード取得失敗");
  }
};


    return (
      <div className="relative group bg-[#F7F7F8] dark:bg-[#343541] p-4 rounded-2xl shadow-sm my-4 overflow-x-auto text-base font-mono max-w-2xl mx-auto">
        <div className="absolute top-2 right-2 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            onClick={copyToClipboard}
            title="コピー"
            className="hover:underline hover:text-gray-800 dark:hover:text-white transition"
          >
            コピー
          </button>
          <span className="hover:underline hover:text-gray-800 dark:hover:text-white transition">
            ✏️ 編集する
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-words">{children}</pre>
      </div>
    );
  },

  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1 ml-5">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1 ml-5">{children}</ol>
  ),

  li: ({ children }) => <li className="ml-1">{children}</li>,

  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="table-auto border-collapse w-full text-left text-sm">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-gray-100 dark:bg-gray-700 text-sm">{children}</thead>
  ),

  tbody: ({ children }) => <tbody>{children}</tbody>,

  tr: ({ children }) => (
    <tr className="border-b border-gray-300 dark:border-gray-600">{children}</tr>
  ),

  th: ({ children }) => <th className="p-2 font-semibold">{children}</th>,

  td: ({ children }) => <td className="p-2">{children}</td>,

  img: ({ src, alt }) => (
    <img src={src} alt={alt} className="my-4 max-w-full rounded-xl shadow" loading="lazy" />
  ),

  audio: ({ src }) => (
    <audio controls src={src} className="my-2 w-full" />
  ),
};

export default markdownComponents;
