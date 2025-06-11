"use client";

import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { forgotPassword } from "../_utils/authActions";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccess(
          "Check your inbox! A link to reset your password has been sent."
        );
      }
      if (!res.success) {
        setError(res.message);
      }
    } catch (err) {
    } finally {
      setEmail("");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-200">Forgot Password</h1>
          <p className="mt-2 text-slate-400">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 ">
          {error && (
            <div className="pl-24 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              startContent={<Mail className="w-8 h-8 text-slate-400 mr-12" />}
              classNames={{
                label: "text-white",
                input: "text-white",
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
            Send Reset Link
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
