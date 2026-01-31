import React from "react";

function NoticeBar({notice, redNotice, onClick}) {

  return (
    <>
      {notice && (
        <div className="fixed top-17 animate-pulse right-4 z-50">
          <div
            onClick={(e)=>onClick("")}
            className={`
              px-4 py-2 rounded-lg shadow-lg cursor-pointer
              backdrop-blur-md transition-all text-white
              ${
                redNotice
                  ? "bg-red-500/20 border border-red-500/40 text-red-300"
                  : "bg-teal-400/20 border border-teal-400/40 text-teal-300"
              }
            `}
          >
            {notice}
          </div>
        </div>
      )}
    </>
  );
}

export default NoticeBar;
