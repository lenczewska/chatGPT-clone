// import { dummyPublishedImages } from "@/assets/assets";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";

const Community = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const fetchImages = async () => {
    setImages(dummyPublishedImages);
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-purple-100">
        Community Images
      </h2>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((item, index) => (
            <a
              href={item.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
              className="group relative block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-purple-700"
            >
              <img
                src={item.imageUrl}
                className="h-48 w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 sm:h-56 lg:h-64"
                alt={`Created by ${item.userName}`}
              />
              <p className="absolute bottom-0 right-0 rounded-tl-xl bg-black/50 px-4 py-1 text-xs text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                Created by {item.userName}
              </p>
            </a>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-gray-600 dark:text-purple-200">
          No images
        </p>
      )}
    </div>
  );
};

export default Community;