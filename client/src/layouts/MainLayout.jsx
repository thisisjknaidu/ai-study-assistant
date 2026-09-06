import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function MainLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Subjects", path: "/subjects", icon: "📚" },
    { name: "Notes", path: "/notes", icon: "📝" },
    { name: "Study Plan", path: "/study-plan", icon: "📅" },
    { name: "Create Task", path: "/study-plan/create", icon: "➕" },
    { name: "AI Study Plan", path: "/ai-study-plan", icon: "🧠" },
    { name: "AI Tutor", path: "/ai-tutor", icon: "🤖" },
    { name: "Quiz", path: "/quiz", icon: "❓" },
    { name: "Quiz Stats", path: "/quiz-stats", icon: "📈" },
    { name: "Quiz History", path: "/quiz-history", icon: "📊" },
  ];

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const userName = user?.name || "Student";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleNavigation = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:h-screen bg-slate-900 text-white p-6 flex-col sticky top-0 shrink-0">
        <div>
          <h1 className="text-2xl font-bold mb-8 whitespace-nowrap">
            Study With AI🎓
          </h1>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-blue-600" : "hover:bg-slate-800"
                  }`
                }
              >
                <span className="text-lg shrink-0">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-slate-900 text-white p-5 flex flex-col transform transition-transform duration-300 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold whitespace-nowrap">
            Study With AI🎓
          </h1>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-300 hover:text-white text-2xl px-2"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="space-y-2 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive ? "bg-blue-600" : "hover:bg-slate-800"
                }`
              }
            >
              <span className="text-lg shrink-0">{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition shrink-0"
              aria-label="Open menu"
            >
              <span className="text-2xl">☰</span>
            </button>

            <h2 className="font-semibold text-slate-700 truncate">
              AI Study Assistant
            </h2>
          </div>

          {/* User */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {userInitial}
            </div>

            <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[160px] truncate">
              {userName}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default MainLayout;
