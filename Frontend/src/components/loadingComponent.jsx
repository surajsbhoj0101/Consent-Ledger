import React from "react";

function Loading({ isLoading, loadingMessage }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-app-bg-deep/65 backdrop-blur-sm">
      <div className="app-loader-shell">
        <div className="app-loader" aria-hidden="true">
          <span className="app-loader-ring app-loader-ring-outer" />
          <span className="app-loader-ring app-loader-ring-inner" />
          <span className="app-loader-dot" />
        </div>
        {loadingMessage && (
          <p className="mt-4 text-sm font-medium text-brand-soft tracking-wide">
            {loadingMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loading;
