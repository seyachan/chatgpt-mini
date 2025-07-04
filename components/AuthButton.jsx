import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthButton() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />;
  }

  if (user) {
    return (
      <button
        onClick={logout}
        title={`ログアウト: ${user.name || user.email}`}
        className="w-9 h-9 bg-gray-700 dark:bg-gray-500 rounded-full flex items-center justify-center text-white text-md font-bold cursor-pointer hover:opacity-80 transition-opacity"
      >
        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 text-sm font-medium transition-colors"
    >
      <LogIn size={16} />
      <span>ログイン</span>
    </button>
  );
}