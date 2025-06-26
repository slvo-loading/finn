import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordConfirmationInput({
  password,
  confirmPassword,
  setConfirmPassword,
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const isMatch = confirmPassword === password || confirmPassword.length === 0;

  return (
    <div className="w-full">
  <div
    className={`flex items-center px-4 py-3 rounded-xl border text-sm ${
      isMatch
        ? "border-gray-300 focus-within:ring-[#a6d1eb]"
        : "border-red-400 focus-within:ring-red-200"
    } focus-within:ring`}
  >
    <input
      type={showConfirm ? "text" : "password"}
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm Password"
      className="flex-1 bg-transparent outline-none"
    />
    <button
      type="button"
      onClick={() => setShowConfirm(!showConfirm)}
      className="text-gray-500 hover:text-gray-700"
      tabIndex={-1}
    >
      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
    </div>
    <p
        className={`text-xs text-red-500 mt-1 transition-opacity duration-200 ${
            isMatch ? "opacity-0" : "opacity-100"
        }`}>
        Passwords don’t match.
    </p>
</div>
  );
}
