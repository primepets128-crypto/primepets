import React from 'react';

/**
 * Universal media component to render an image or a video 
 * based on the file extension or the URL contents.
 */
export default function MediaDisplay({ src, alt = "Media", className = "", ...props }) {
  if (!src) return null;
  
  // Check if it's a video based on common extensions or Cloudinary video indicators
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$/i) || src.includes('/video/upload/');

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        {...props}
      />
    );
  }

  return <img src={src} alt={alt} className={className} {...props} />;
}
