import { useUserStore } from "../../store/userStore";
import { useState } from "react";
import {
  HiOutlineHome,
  HiOutlineHashtag,
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlinePencilSquare,
} from "react-icons/hi2";
import NotLoggedInAlertModal from "../common/NotLoggedInAlertModal";
import SharePostModal from "../common/SharePostModal";
import { Link, useLocation, NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isSharingPost, setIsSharingPost] = useState(false);
  const [isNotLoggedIn, setIsNotLoggedIn] = useState(false);

  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const isAuthenticated = !!user;

  const handleSharePost = () => {
    if (!isAuthenticated) {
      setIsNotLoggedIn(true);
    } else {
      setIsSharingPost(true);
    }
  };

  return (
    <>
      <aside className="w-64 border-r border-secondary bg-background flex flex-col h-full p-6">
        {/* Navigation Groups */}
        <nav className="flex-1 space-y-8">
          {/* Main Section */}
          <div className="space-y-1">
            <NavLink
              to={"/"}
              className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg font-medium transition-colors`}
            >
              <HiOutlineHome className="w-5 h-5" />
              <span className="text-sm">Home</span>
            </NavLink>

            <Link
              to={"/discover"}
              className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/discover" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg transition-colors group`}
            >
              <HiOutlineHashtag className="w-5 h-5" />
              <span className="text-sm">Discover</span>
            </Link>

            <Link
              to={"/library"}
              className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/library" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg transition-colors group`}
            >
              <HiOutlineBookOpen className="w-5 h-5" />
              <span className="text-sm">My Library</span>
            </Link>

            <Link
              to={"/network"}
              className={`flex items-center justify-between px-3 py-2 ${location.pathname === "/network" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg transition-colors group`}
            >
              <div className="flex items-center gap-3">
                <HiOutlineUsers className="w-5 h-5" />
                <span className="text-sm">Network</span>
              </div>
              <span className="bg-primary text-background text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                3
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-secondary" />

          {/* Account Section */}
          <div className="space-y-1">
            <Link
              to={"/profile"}
              className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/profile" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg transition-colors group`}
            >
              <HiOutlineUser className="w-5 h-5" />
              <span className="text-sm">Profile</span>
            </Link>

            <Link
              to={"/settings"}
              className={`flex items-center gap-3 px-3 py-2 ${location.pathname === "/settings" ? "bg-primary text-background hover:bg-foreground" : "text-foreground/75 hover:bg-secondary hover:text-foreground"} rounded-lg transition-colors group`}
            >
              <HiOutlineCog6Tooth className="w-5 h-5" />
              <span className="text-sm">Settings</span>
            </Link>
          </div>
        </nav>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            className="w-full bg-primary hover:bg-foreground text-background rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            onClick={handleSharePost}
          >
            <HiOutlinePencilSquare className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">
              New Post
            </span>
          </button>
        </div>
      </aside>

      {isSharingPost && <SharePostModal setIsSharingPost={setIsSharingPost} />}
      {isNotLoggedIn && (
        <NotLoggedInAlertModal setIsNotLoggedIn={setIsNotLoggedIn} />
      )}
    </>
  );
};

export default Sidebar;
