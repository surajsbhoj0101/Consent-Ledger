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
      name: "purposes",
      path: "/company/purposes",
      icon: <Users />,
    },
    {
      name: "Consent Request",
      path: "#",
      icon: <FilePenLine />,
    },
    {
      name: "Audit Logs",
      path: "#",
      icon: <BookOpenText />,
    },
    {
      name: "Settings",
      path: "/settings",
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
      path: "#",
      icon: <Users />,
    },
    {
      name: "History",
      path: "#",
      icon: <History />,
    },
    {
      name: "Settings",
      path: "#",
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

  return (
    <div
      style={robotoStyle}
      className={`relative h-screen bg-gradient-to-b from-[rgba(30,41,59,0.5)] via-[rgba(20,30,48,0.4)] to-[rgba(15,23,42,0.3)] backdrop-blur-md border-r border-[rgba(127,164,196,0.15)] text-white transition-all duration-300 overflow-hidden ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Glowing accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7fa4c4] to-transparent opacity-30" />

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-[rgba(127,164,196,0.1)]">
        <Link to="/" className={`${!isOpen && "hidden"}`}>
          <span className="hidden md:block text-lg tracking-wide text-white/70 font-semibold">
            CONSENT LEDGER
          </span>
        </Link>
        <button
          onClick={toggleSidebar}
          className="text-white flex items-center justify-center hover:text-[#9db5d6] transition-all duration-200 p-2 rounded-lg hover:bg-[rgba(127,164,196,0.15)] active:scale-95"
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
                    ? "bg-gradient-to-r from-[rgba(127,164,196,0.25)] to-[rgba(127,164,196,0.1)] text-[#7fa4c4] shadow-lg shadow-[rgba(127,164,196,0.2)]"
                    : "text-[#b0bfcc] hover:bg-[rgba(127,164,196,0.1)] hover:text-[#7fa4c4]"
                } ${!isOpen && "justify-center px-0 py-3"}`}
              >
                {/* Animated background */}
                {isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7fa4c4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                )}

                <span
                  className={`text-lg flex-shrink-0 transition-transform duration-200 ${isActive(item.path) ? "text-[#7fa4c4]" : "group-hover:scale-110"}`}
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
