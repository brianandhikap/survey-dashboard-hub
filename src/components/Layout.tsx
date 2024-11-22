import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/customers" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
                ID Pelanggan
              </Link>
              <Link to="/questions" className="flex items-center px-4 text-gray-700 hover:text-gray-900">
                Pertanyaan
              </Link>
            </div>
            <Button onClick={handleLogout} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;