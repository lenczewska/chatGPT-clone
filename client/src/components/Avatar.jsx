import React from "react";

const Avatar = ({ user, size = 20 }) => {
  const firstLetter = user?.name?.charAt(0).toUpperCase() 
    || user?.email?.charAt(0).toUpperCase() 
    || "A";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-xs "
    >
      {firstLetter}
    </div>
  );
};

export default Avatar;