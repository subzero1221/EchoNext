"use client";

import { useState } from "react";
import Image from "next/image";
import { BsX } from "react-icons/bs";

export default function PostImage({ imageUrl, highQualityUrl }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track image loading state

  return (
    <>
      <div
        className="rounded-xl overflow-hidden mb-6 cursor-pointer relative ml-8"
        onClick={() => setIsOpen(true)}
      >
        {/* Skeleton Loader */}
        {isLoading && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="w-full h-full bg-gray-300 animate-shimmer">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-x-12"></div>
            </div>
          </div>
        )}

        {/* Image */}
        <Image
          src={imageUrl}
          alt="Post Image"
          width={600}
          height={400}
          className={`!w-[600px] !h-[400px] object-cover  transition-transform duration-300 hover:scale-105  ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50"
          onClick={() => setIsOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent closing when clicking the button
              setIsOpen(false);
            }}
            className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full 
                      bg-white/90 hover:bg-white transition-all duration-200 
                      group shadow-lg hover:shadow-xl z-50"
            aria-label="Close modal"
          >
            <BsX
              className="w-7 h-7 text-gray-600 group-hover:text-gray-800 
                      group-hover:rotate-90 transition-all duration-200"
            />
          </button>

          {/* Image Container */}
          <div
            className="relative rounded-lg max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <Image
              src={highQualityUrl || imageUrl}
              alt="Full Size Image"
              width={1200} // Larger in modal
              height={800}
              className="object-contain w-auto h-auto"
              style={{ maxWidth: "100%", maxHeight: "90vh" }} // Ensure it fits within the viewport
            />
          </div>
        </div>
      )}
    </>
  );
}
