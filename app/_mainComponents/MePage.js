"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../redux/features/auth/authSlice";
import Image from "next/image";
import {
  updatePassword,
  updateProfileData,
  uploadUserAvatar,
} from "../_utils/userActions";
import { toast } from "react-toastify";

export default function MePage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    nickName: user?.nickName || "",
    email: user?.email || "",
  });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    curPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  // Photo Upload State
  const [photoFile, setPhotoFile] = useState(null);

  const handleBasicInfoChange = (e) => {
    setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const updatePhoto = async (e) => {
    e.preventDefault();
    if (!photoFile) return;

    const formData = new FormData();
    formData.append("photo", photoFile);
    setLoading(true);
    try {
      const res = await uploadUserAvatar(formData);
      if (res.user) {
        dispatch(setUser(res.user));
        toast.success("Avatar upload successful");
      }
    } catch (err) {
      toast.error(err);
    }
    setLoading(false);
  };

  const handleUpdateProfileData = async (e) => {
    e.preventDefault();
    const email = basicInfo.email;
    const nickName = basicInfo.nickName;

    try {
      const res = await updateProfileData(email, nickName);
      if (res) {
        dispatch(setUser(res.user));
        toast.success("Profile update successful");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await updatePassword(passwordData);
      if (res.success) {
        toast.success("Password update successful");
      }
      toast.error(res);
    } catch (err) {}
  };

  if (!user)
    return (
      <div className="text-2xl text-white flex justify-center align-center mt-64 mr-48">
        Log in to get access 🚫
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-slate-400">Manage your account preferences</p>
          {message.text && (
            <div
              className={`mt-4 p-3 rounded-lg shadow-sm border ${
                message.type === "success"
                  ? "bg-green-900/50 border-green-500/20 text-green-400"
                  : "bg-red-900/50 border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Photo Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 border border-purple-500/10 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Profile Photo
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="relative w-32 h-32 group">
              <Image
                src={
                  user?.avatarUrl ? `${user?.avatarUrl}` : `/userDefault.jpg`
                }
                alt="Profile"
                fill
                className="rounded-full object-cover ring-4 ring-purple-500/20 shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300" />
            </div>
            <form onSubmit={updatePhoto} className="flex-1 max-w-sm w-full">
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full text-sm text-slate-400 
                    file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 
                    file:text-sm file:font-medium file:bg-purple-500/10 file:text-purple-400 
                    hover:file:bg-purple-500/20 transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                />
                <button
                  type="submit"
                  disabled={!photoFile || loading}
                  className="w-full px-4 py-2.5 border border-transparent rounded-lg shadow-sm 
                    text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900
                    disabled:opacity-50 transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Basic Info Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 border border-purple-500/10 transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Basic Information
          </h2>
          <form onSubmit={handleUpdateProfileData} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">
                Nickname
              </label>
              <input
                type="text"
                name="nickName"
                value={basicInfo.nickName}
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-200
                  focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={basicInfo.email}
                onChange={handleBasicInfoChange}
                className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-200
                  focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 border border-transparent rounded-lg shadow-sm 
                text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900
                disabled:opacity-50 transition-all duration-300"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Password Section */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl p-8 border border-purple-500/10 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full -mr-20 -mt-20 opacity-50" />
          <div className="relative">
            <h2 className="text-2xl font-semibold mb-6 text-purple-300 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Change Password
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">
                  Current Password
                </label>
                <input
                  type="password"
                  name="curPassword"
                  value={passwordData.curPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-200
                    focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-200
                    focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="newPasswordConfirm"
                  value={passwordData.newPasswordConfirm}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-lg bg-slate-800 border-slate-700 text-slate-200
                    focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 border border-transparent rounded-lg shadow-sm 
                  text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900
                  disabled:opacity-50 transition-all duration-300"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
