import React, { useState } from "react";

const PerfilSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="perfil-section">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <h2>{title}</h2>
        <span>{open ? "-" : "+"}</span>
      </div>
      {open && <div className="section-content">{children}</div>}
    </div>
  );
};

export default PerfilSection;