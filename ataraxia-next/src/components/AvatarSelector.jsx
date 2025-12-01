import React from "react";

const AvatarSelector = ({ avatar, setAvatar, avatarList }) => {
  return (
    <div className="avatar-selector">
      <h2 className="section-title">Elegí tu Avatar</h2>
      <div className="avatar-grid">
        {avatarList.map((a, index) => (
          <img
            key={index}
            src={a}
            alt={`Avatar ${index}`}
            className={`avatar ${avatar === a ? "selected" : ""}`}
            onClick={() => setAvatar(a)}
          />
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;