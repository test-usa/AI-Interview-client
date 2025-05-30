import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import Container from "./container";
import dbLogo from "../assets/logos/dbLogo.png";
import { useAuth } from "../context/AuthProvider";
import { IoHome } from "react-icons/io5";
import { MdOutlineBusinessCenter } from "react-icons/md";
import { MdOutlineInsights } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import Notification from "../pages/userPages/notifications/Notification";

const UserOrAdminDBLayout = () => {
  const { user, logout } = useAuth();
  const userData = user?.userData; // Safely access userData
  const userMeta = user?.userMeta; // Corrected to user?.meta
  const userType = user?.userData?.role; // Safely access role
  console.log("user********************", user, "meta*********", userMeta);

  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle sidebar

  // Define routes based on user type (relative to /userDashboard)
  const userRoutes = [
    {
      name: "Mock Interviews",
      logo: <IoHome />,
      to: "mockInterview",
    },
    {
      name: "My Jobs",
      logo: <MdOutlineBusinessCenter />,
      to: "myJobs",
    },
    {
      name: "Insights",
      logo: <MdOutlineInsights />,
      to: "incites",
    },
    {
      name: "Settings",
      logo: <IoSettings />,
      to: "settings",
    },
  ];

  const adminRoutes = [
    {
      name: "Dashboard",
      logo: null,
      to: "dashboard",
    },
    {
      name: "Content Management",
      logo: null,
      to: "content_management",
    },
    {
      name: "User Management",
      logo: null,
      to: "user-management",
    },
    {
      name: "Payment Management",
      logo: null,
      to: "payment-management",
    },
    {
      name: "Notification",
      logo: null,
      to: "manage-user",
    },
    {
      name: "Settings",
      logo: null,
      to: "settings-manage",
    },
  ];

  const handleNavigation = (path) => {
    navigate(`/userDashboard/${path}`);
  };

  const handleLogout = () => {
    // Clear the redirect flag on logout
    logout();
    localStorage.removeItem("hasRedirected");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Combined logic for meta-based redirects and first route navigation
  useEffect(() => {
    if (!userType) {
      console.log("Waiting for userType to be available");
      return; // Wait until userType is available
    }

    const currentPath = location.pathname;
    const routes = userType === "admin" ? adminRoutes : userRoutes;

    // Check if the initial redirect has already happened
    const hasRedirected = localStorage.getItem("hasRedirected");

    if (!hasRedirected) {
      // Step 1: Meta-based redirects for non-admin users
      if (userType !== "admin" && userMeta) {
        const completedSteps = userMeta;

        if (
          !completedSteps.isResumeUploaded &&
          currentPath !== "/resume-upload"
        ) {
          console.log(
            "Redirecting to /resume-upload due to isResumeUploaded=false"
          );
          localStorage.setItem("hasRedirected", "true"); // Set the flag
          navigate("/resume-upload");
          return; // Exit early after redirect
        } else if (
          !completedSteps.isAboutMeGenerated &&
          currentPath !== "/generateAboutMe"
        ) {
          console.log(
            "Redirecting to /generateAboutMe due to isAboutMeGenerated=false"
          );
          localStorage.setItem("hasRedirected", "true"); // Set the flag
          navigate("/generateAboutMe");
          return; // Exit early after redirect
        } else if (
          !completedSteps.isAboutMeVideoChecked &&
          currentPath !== "/generateAboutMe"
        ) {
          console.log(
            "Redirecting to /generateAboutMe due to isAboutMeVideoChecked=false"
          );
          localStorage.setItem("hasRedirected", "true"); // Set the flag
          navigate("/generateAboutMe");
          return; // Exit early after redirect
        }
      }

      // Step 2: First route navigation (if no meta-based redirect occurred)
      const isCurrentRouteValid = routes.some(
        (route) =>
          currentPath === `/userDashboard/${route.to}` ||
          currentPath.startsWith(`/userDashboard/mockInterview/`) // Allow dynamic route
      );

      if (!isCurrentRouteValid) {
        const firstRoute = routes[0];
        console.log(
          `Performing initial redirect to: /userDashboard/${firstRoute.to}`
        );
        localStorage.setItem("hasRedirected", "true"); // Set the flag
        navigate(`/userDashboard/${firstRoute.to}`);
      } else {
        // If the current route is valid, still set the flag to prevent future redirects
        localStorage.setItem("hasRedirected", "true");
        console.log(
          `Current route ${currentPath} is valid, setting hasRedirected flag`
        );
      }
    } else {
      console.log("Initial redirect already performed, skipping");
    }
  }, [userType, navigate, userMeta]); // Dependencies: userType, navigate, userMeta

  return (
    <Container>
      <div className="h-screen w-screen flex bg-gray-100 max-w-[1440px]">
        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-white bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`fixed lg:static h-full bg-transparent text-white flex flex-col transition-all duration-300 z-30 ${
            isSidebarOpen ? "w-64" : "w-0 lg:w-64 overflow-hidden"
          }`}
          style={{ boxShadow: "2px 0 2px rgba(0, 0, 0, 0.1)" }}
        >
          {/* Toggle Button for Mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 text-white z-40"
          >
            ✕
          </button>

          {/* Sidebar Header */}
          <Link to="/" className="bg-white">
            <div className="p-4 text-2xl font-bold border-b">
              <img src={dbLogo} alt="logo not available" />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 bg-white">
            {(userType === "admin" ? adminRoutes : userRoutes).map(
              (route, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(route.to)}
                  className={`w-full text-left py-2 px-4 rounded transition ${
                    location.pathname === `/userDashboard/${route.to}`
                      ? "bg-[#3A4C67] text-white"
                      : "hover:bg-[#3A4C67] hover:text-white text-[#676768]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {route.logo || null}
                    <h2>{route.name}</h2>
                  </div>
                </button>
              )
            )}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t bg-white">
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 px-4 rounded transition"
            >
              <div className="flex gap-4 items-center cursor-pointer">
                <span className="text-red-600">
                  <RiLogoutBoxLine />
                </span>
                <span className="text-black">Logout</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-full mx-auto flex-1 flex flex-col">
          {/* Header with Toggle Button */}
          <div className="bg-white p-4 shadow flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-[#37B874] focus:outline-none text-4xl"
            >
              ☰
            </button>

            <div className="flex items-center w-full justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-16 h-16 rounded-[8px]">
                  <img
                    src={
                      userData?.profilePicture ||
                      "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg"
                    }
                    alt="User Profile"
                    className="w-full h-full rounded-[8px]"
                  />
                </div>
                <div className="text-gray-600">
                  <h2 className="text-[#676768]">Welcome Back</h2>
                  <h2 className="text-[20px] font-medium">
                    {userData?.name?.toUpperCase() || "Guest"}
                  </h2>
                </div>
              </div>

              {userType === "user" && <Notification />}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserOrAdminDBLayout;
