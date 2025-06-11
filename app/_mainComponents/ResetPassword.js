"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button } from "@nextui-org/react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { resetPassword } from "../_utils/authActions";

export default function ResetPassword({ resetToken }) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await resetPassword(resetToken, password, passwordConfirm);
      if (res.success) {
        setSuccess("Password reset successful");
      }
      if (!res.success) {
        setError(res.message);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
      setPassword("");
      setPasswordConfirm("");
    }
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-slate-200 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-slate-400 mb-6">
            The password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="text-purple-400 hover:text-purple-300"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-200">Reset Password</h1>
          <p className="mt-2 text-slate-400">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg pl-28">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              startContent={<Lock className="w-4 h-4 text-slate-400 mr-5" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              }
              classNames={{
                label: "text-slate-300",
                input: "text-slate-200",
                inputWrapper: "bg-slate-800/50 border-slate-700",
              }}
            />

            <Input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="Confirm your new password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              minLength={8}
              startContent={<Lock className="w-4 h-4 text-slate-400 mr-5" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="focus:outline-none"
                >
                  {showPasswordConfirm ? (
                    <EyeOff className="w-4 h-4 text-slate-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              }
              classNames={{
                label: "text-slate-300",
                input: "text-slate-200",
                inputWrapper: "bg-slate-800/50 border-slate-700",
              }}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
            isLoading={isLoading}
          >
            Reset Password
          </Button>

          <div className="text-center">
            <Link
              href="/signin"
              className="text-slate-400 hover:text-purple-400 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
