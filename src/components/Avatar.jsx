import React from "react";

const Avatar = ({ user, size = 40 }) => {
  const firstLetter = user?.name?.charAt(0).toUpperCase();

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
      className="rounded-full bg-pink-300 flex items-center justify-center text-white font-semibold"
    >
    A
    </div>
  );
};

export default Avatar;
