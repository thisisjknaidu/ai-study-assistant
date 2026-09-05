import { NavLink, Outlet, useNavigate } from "react-router-dom";

function MainLayout() {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 h-screen bg-slate-900 text-white p-6 flex flex-col sticky top-0">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold mb-8">Study With AI🎓</h1>

          {/* Navigation */}
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
                <span>{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
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
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <h2 className="font-semibold text-slate-700">AI Study Assistant</h2>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {userInitial}
            </div>

            <span className="text-sm font-medium text-slate-700">
              {userName}
            </span>
          </div>
        </header>

        {/* Page */}
        <section className="p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default MainLayout;
