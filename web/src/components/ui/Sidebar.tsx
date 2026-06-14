import {
  HiOutlineHome,
  HiOutlineHashtag,
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
} from "react-icons/hi2";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-gray-200 bg-white flex flex-col h-full p-6">
      {/* Navigation Groups */}
      <nav className="flex-1 space-y-8">
        {/* Main Section */}
        <div className="space-y-1">
          <Link
            to={"/"}
            className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} rounded-lg font-medium transition-colors`}
          >
            <HiOutlineHome className="w-5 h-5" />
            <span className="text-sm">Home</span>
          </Link>

          <Link
            to={"/discover"}
            className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/discover" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} hover:bg-gray-50 rounded-lg transition-colors group`}
          >
            <HiOutlineHashtag className="w-5 h-5 group-hover:text-gray-700" />
            <span className="text-sm group-hover:text-gray-700">Discover</span>
          </Link>

          <Link
            to={"/library"}
            className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/library" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} hover:bg-gray-50 rounded-lg transition-colors group`}
          >
            <HiOutlineBookOpen className="w-5 h-5 group-hover:text-gray-700" />
            <span className="text-sm group-hover:text-gray-700">
              My Library
            </span>
          </Link>

          <Link
            to={"/network"}
            className={`flex items-center justify-between px-3 py-2 ${location.pathname === "/network" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} hover:bg-gray-50 rounded-lg transition-colors group`}
          >
            <div className="flex items-center gap-3">
              <HiOutlineUsers className="w-5 h-5 group-hover:text-gray-700" />
              <span className="text-sm group-hover:text-gray-700">Network</span>
            </div>
            <span className="bg-[#2A6B56] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              3
            </span>
          </Link>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300" />

        {/* Account Section */}
        <div className="space-y-1">
          <Link
            to={"/profile"}
            className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/profile" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} hover:bg-gray-50 rounded-lg transition-colors group`}
          >
            <HiOutlineUser className="w-5 h-5 group-hover:text-gray-700" />
            <span className="text-sm group-hover:text-gray-700">Profile</span>
          </Link>

          <Link
            to={"/settings"}
            className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/settings" ? "bg-[#E8F3EF] text-[#2A6B56]" : "text-gray-500"} hover:bg-gray-50 rounded-lg transition-colors group`}
          >
            <HiOutlineCog6Tooth className="w-5 h-5 group-hover:text-gray-700" />
            <span className="text-sm group-hover:text-gray-700">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Action Button */}
      <div className="mt-auto">
        <button className="w-full bg-[#2A6B56] hover:bg-[#215343] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer">
          <HiOutlinePencilSquare className="w-5 h-5" />
          <span className="text-sm font-semibold tracking-wide">New Post</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
