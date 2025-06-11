"use client";

import { FaUser } from "react-icons/fa";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function PendingPostCard({ post, communityName }) {
  return (
    <div className="w-full">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
          {post.createdBy?.photoUrl ? (
            <Image
              src={post.createdBy.photoUrl}
              alt={post.createdBy.nickName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="w-4 h-4 text-slate-400" />
          )}
        </div>
        <div>
          <Link
            href={`/user/${post.createdBy._id}`}
            className="text-white font-medium flex"
          >
            Posted by
            <p className="text-blue-400 ml-1 hover:text-blue-300">
              {" "}
              u/{post.createdBy.nickName}
            </p>
          </Link>
          <p className="text-slate-400 text-sm">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {/* Post Title */}
      <h2 className="text-xl font-bold text-white mb-3">{post.title}</h2>

      {/* Post Content */}
      {post.content && (
        <div className="text-slate-300 mb-4 whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="space-y-4 mb-4">
          {post.images.map((image, index) => (
            <div key={index} className="relative w-full aspect-video">
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Category */}
      {post.category && (
        <div className="text-slate-400 text-sm mb-4">
          Category: {post.category}
        </div>
      )}
    </div>
  );
}
