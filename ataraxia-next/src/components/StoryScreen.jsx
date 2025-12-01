import React from "react";

export default function StoryScreen({ title, subtitle, bullets = [], imageSrc, onStart }) {
  return (
    <div className="rounded-3xl p-6 md:p-8 bg-white border shadow-sm grid md:grid-cols-[1.2fr,1fr] gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">{title}</h1>
        <p className="text-slate-600 mt-2">{subtitle}</p>
        <ul className="mt-4 space-y-2 text-slate-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <span>•</span> <span>{b}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onStart}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold"
          style={{ background: "#3B82F6" }}
        >
          Comenzar misión <span>›</span>
        </button>
      </div>

      <div className="relative">
        {imageSrc && (
          <>
            <img src={imageSrc} alt="" className="w-full h-auto rounded-2xl" />
            <div className="absolute -z-10 right-0 bottom-0 w-56 h-56 rounded-full blur-2xl opacity-40"
                 style={{ background: "#3B82F6" }}/>
          </>
        )}
      </div>
    </div>
  );
}
