import { Link, useLocation } from "react-router-dom";
import { MdHome, MdDashboard } from "react-icons/md";
import "./Sidebar.css";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  // Tipizacija ikonica
  const HomeIcon = MdHome as React.FC<{ className?: string }>;
  const DashboardIcon = MdDashboard as React.FC<{ className?: string }>;

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`} onMouseEnter={() => !isOpen && toggleSidebar()} onMouseLeave={() => isOpen && toggleSidebar()}>
      {/* Hover area za otvaranje sidebara */}
      <div className="sidebar-hover-area"></div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
            <Link to="/" className="nav-link">
              <HomeIcon className="nav-icon" />
              <span className="nav-text">Home</span>
            </Link>
          </li>
          <li className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
            <Link to="/dashboard" className="nav-link">
              <DashboardIcon className="nav-icon" />
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;