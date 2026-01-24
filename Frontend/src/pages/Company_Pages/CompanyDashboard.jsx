import React from "react";

function CompanyDashboard() {
  const orbitronStyle = { fontFamily: "Orbitron, sans-serif" };
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  return (
    <div
      style={robotoStyle}
      className="relative min-h-screen overflow-hidden bg-[#14171d]"
    >
      <div className="absolute inset-0 bg-[#12151b]" />

      {/* large muted blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(127,164,196,0.12),transparent_65%),radial-gradient(circle_at_80%_30%,rgba(127,164,196,0.10),transparent_70%),radial-gradient(circle_at_50%_85%,rgba(127,164,196,0.08),transparent_70%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.95))]" />
    </div>
  );
}

export default CompanyDashboard;
