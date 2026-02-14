import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PanelLeftOpen,
  PanelRightOpen,
  Grid2x2,
  Users,
  FilePenLine,
  BookOpenText,
  Settings,
  History,
  Database,
  User
} from "lucide-react";

function Sidebar({ role }) {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem("sidebarOpen") !== "false");
  const location = useLocation();
  const robotoStyle = { fontFamily: "Roboto, sans-serif" };
  const [menuItems, setMenuItems] = useState();
  const companyMenuItems = [
    {
      name: "Dashboard",
      path: "/company/dashboard",
      icon: <Grid2x2 />,
    },
    {
      name: "Manage Users",
      path: "/company/users",
      icon: <Users />
    }
    ,
    {
      name: "purposes",
      path: "/company/purposes",
      icon: <Database />,
    },
    {
      name: "Consent Request",
      path: "/company/consent-request",
      icon: <FilePenLine />,
    },
    {
      name: "Profile",
      path: "/company/profile",
      icon: <User />,
    },
    {
      name: "Audit Logs",
      path: "/company/audit-logs",
      icon: <BookOpenText />,
    },
    {
      name: "Settings",
      path: "/company/settings",
      icon: <Settings />,
    },
  ];

  const consumerMenuItems = [
    {
      name: "Dashboard",
      path: "/consumer/dashboard",
      icon: <Grid2x2 />,
    },
    {
      name: "My Consents",
      path: "/consumer/consents",
      icon: <Users />,
    },
    {
      name: "History",
      path: "/consumer/history",
      icon: <History />,
    },
    {
      name: "Profile",
      path: "/consumer/profile",
      icon: <Settings />,
    },
    {
      name: "Settings",
      path: "/consumer/settings",
      icon: <Settings />,
    },
  ];

  const isConsumer = role == "consumer" ? true : false;

  useEffect(() => {
    if (isConsumer) {
      setMenuItems(consumerMenuItems);
    } else {
      setMenuItems(companyMenuItems);
    }
  }, [isConsumer]);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("sidebarOpen", newState);
    window.dispatchEvent(new Event("sidebarToggle"));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const sidebarBorderClass = isConsumer
    ? "border-r border-[rgba(127,164,196,0.15)]"
    : "border-r border-[rgba(127,164,196,0.15)]";

  const accentLineClass = isConsumer
    ? "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-30"
    : "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-30";

  const headerBorderClass = isConsumer
    ? "flex justify-between items-center px-4 py-3 border-b border-[rgba(127,164,196,0.1)]"
    : "flex justify-between items-center px-4 py-3 border-b border-[rgba(127,164,196,0.1)]";

  const toggleButtonClass = isConsumer
    ? "text-white flex items-center justify-center hover:text-brand-muted transition-all duration-200 p-2 rounded-lg hover:bg-[rgba(127,164,196,0.15)] active:scale-95"
    : "text-white flex items-center justify-center hover:text-brand-muted transition-all duration-200 p-2 rounded-lg hover:bg-[rgba(127,164,196,0.15)] active:scale-95";

  const activeNavClass = isConsumer
    ? "bg-gradient-to-r from-[rgba(127,164,196,0.25)] to-[rgba(127,164,196,0.1)] text-brand shadow-lg shadow-[rgba(127,164,196,0.2)]"
    : "bg-gradient-to-r from-[rgba(127,164,196,0.25)] to-[rgba(127,164,196,0.1)] text-brand shadow-lg shadow-[rgba(127,164,196,0.2)]";

  const inactiveNavClass = isConsumer
    ? "text-[#b0bfcc] hover:bg-[rgba(127,164,196,0.1)] hover:text-brand"
    : "text-[#b0bfcc] hover:bg-[rgba(127,164,196,0.1)] hover:text-brand";

  const activeBgClass = isConsumer
    ? "absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
    : "absolute inset-0 bg-gradient-to-r from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity";

  const activeIconClass = isConsumer ? "text-brand" : "text-brand";
  const sidebarBgClass = isConsumer
    ? "bg-gradient-to-b from-[rgba(30,41,59,0.55)] via-[rgba(20,30,48,0.45)] to-[rgba(15,23,42,0.35)]"
    : "bg-gradient-to-b from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.3)]";

  return (
    <div
      style={robotoStyle}
      className={`relative h-screen ${sidebarBgClass} backdrop-blur-md ${sidebarBorderClass} text-white transition-all duration-300 overflow-hidden ${isOpen ? "w-full md:w-64" : "w-20 md:w-20"}`}
    >
      {/* Glowing accent line */}
      <div className={accentLineClass} />

      {/* Header */}
      <div className={headerBorderClass}>
        <Link to="/" className={`${!isOpen && "hidden"}`}>
          <span className="hidden md:block text-lg tracking-wide text-white/70 font-semibold">
            CONSENT LEDGER
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className={toggleButtonClass}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <PanelRightOpen size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-3">
          {menuItems?.map((item, index) => (
            <li key={item.path} style={{ animationDelay: `${index * 50}ms` }}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive(item.path)
                    ? activeNavClass
                    : inactiveNavClass
                } ${!isOpen && "justify-center px-0 py-3"}`}
              >
                {/* Animated background */}
                {isActive(item.path) && (
                  <div className={activeBgClass} />
                )}

                <span
                  className={`text-lg flex-shrink-0 transition-transform duration-200 ${isActive(item.path) ? activeIconClass : "group-hover:scale-110"}`}
                >
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="whitespace-nowrap text-sm font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      
    </div>
  );
}

export default Sidebar;
