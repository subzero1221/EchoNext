"use client";
import { useState } from "react";
import {
  BsEnvelope,
  BsPersonCircle,
  BsLock,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";
import { signup } from "../_utils/authActions";
import { useRouter } from "next/navigation";
import { useAuth } from "../_contextComponents/AuthProvider";
import { toast } from "react-toastify";
import { errorStrCorrecter } from "../_utils/config";
import { motion } from "framer-motion";

export default function SignUpForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    nickName: "",
    password: "",
    passwordConfirm: "",
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
   
    console.log(formData);
    const res = await signup(formData);
    if (res.success) {
      login(res.user);
      router.push("/");
      toast.success("Welcome to ShadowsEcho ❤");
    } else {
      console.log(res.message);
      const errorMessage = errorStrCorrecter(res.message);
      toast.error(errorMessage);
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
            Create Account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400 mt-2"
          >
            Join our community today
          </motion.p>
        </div>

        <form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BsEnvelope className="text-purple-400" /> Email
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                className={inputClasses("email")}
                placeholder="your@email.com"
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

          {/* Nickname Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BsPersonCircle className="text-purple-400" /> Nickname
            </label>
            <div className="relative group">
              <input
                type="text"
                name="nickName"
                value={formData.nickName}
                onChange={handleChange}
                onFocus={() => setFocused("nickName")}
                onBlur={() => setFocused("")}
                className={inputClasses("nickName")}
                placeholder="Choose a nickname"
              />
              {errors.nickname && (
                <div className="absolute right-3 top-3 text-red-400">
                  <BsXCircle />
                </div>
              )}
            </div>
            {errors.nickname && (
              <p className="text-red-400 text-sm">{errors.nickname}</p>
            )}
          </div>

          {/* Password Fields */}
          {[
            {
              name: "password",
              label: "Password",
              placeholder: "Create a password",
            },
            {
              name: "passwordConfirm",
              label: "Confirm Password",
              placeholder: "Confirm your password",
            },
          ].map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <BsLock className="text-purple-400" /> {field.label}
              </label>
              <div className="relative group">
                <input
                  type="password"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  onFocus={() => setFocused(field.name)}
                  onBlur={() => setFocused("")}
                  className={inputClasses(field.name)}
                  placeholder={field.placeholder}
                />
                {errors[field.name] && (
                  <div className="absolute right-3 top-3 text-red-400">
                    <BsXCircle />
                  </div>
                )}
              </div>
              {errors[field.name] && (
                <p className="text-red-400 text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}

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
            Create Account
          </motion.button>

          {/* Sign In Link */}
          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a
              href="/signin"
              className="text-purple-400 hover:text-purple-300 font-medium 
              transition-colors duration-200"
            >
              Sign in
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
