"use client";

import { useState } from "react";
import {
  BsEnvelope,
  BsPersonCircle,
  BsLock,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import { signin } from "../_utils/authActions";
import { useRouter } from "next/navigation";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useSocket from "../_customhooks/useSocket";

export default function SignIn() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signin(formData);
    if (res.success) {
      login(res.user);
      router.push("/");
      toast.success("Log in successful");
    } else {
      console.log(res);

      toast.error(res.message);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-3 rounded-xl bg-slate-800/50 border text-slate-300
    placeholder:text-slate-500 
    ${
      focused === fieldName
        ? "border-purple-500/50 ring-2 ring-purple-500/20"
        : "border-purple-500/10"
    }
    ${errors[fieldName] ? "border-red-500/50 ring-2 ring-red-500/20" : ""}
    transition-all duration-200 outline-none
  `;

  return (
    <div
      className="min-h-screen w-full mr-48 flex items-center justify-center 
    bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl 
        shadow-xl p-8 w-full max-w-md border border-purple-500/10"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
            bg-clip-text text-transparent"
          >
            Sign In
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 mt-2"
          >
            Welcome back to your profile
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Email/Nickname Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BsEnvelope className="text-purple-400" /> Email or
              <BsPersonCircle className="text-purple-400" /> Nickname
            </label>
            <div className="relative group">
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                onFocus={() => setFocused("identifier")}
                onBlur={() => setFocused("")}
                className={inputClasses("identifier")}
                placeholder="your@email.com or Besso"
              />
              {errors.email && (
                <div className="absolute right-3 top-3 text-red-400">
                  <BsXCircle />
                </div>
              )}
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BsLock className="text-purple-400" /> Password
            </label>
            <div className="relative group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                className={inputClasses("password")}
                placeholder="Enter your password"
              />
              {errors.password && (
                <div className="absolute right-3 top-3 text-red-400">
                  <BsXCircle />
                </div>
              )}
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white 
            py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 
            transition-all duration-200 flex items-center justify-center gap-2
            focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-lg shadow-purple-500/20"
          >
            <BsCheckCircle className="w-5 h-5" />
            Sign in
          </motion.button>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400 text-sm">
            Don't have an account yet?{" "}
            <a
              href="/signup"
              className="text-purple-400 hover:text-purple-300 font-medium 
              transition-colors duration-200"
            >
              Sign up
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}
