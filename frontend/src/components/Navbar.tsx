import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserName(parsed.full_name || parsed.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <nav className="w-full px-10 py-4 flex justify-between items-center border-b">
      <h1 className="text-xl font-bold">GEMELLERY</h1>

      {userName ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold">
            Welcome, {userName}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/signin")}
          className="text-sm font-semibold"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}

export default Navbar;
