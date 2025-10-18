import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            {/* Logo on the left */}
            <h2 className="logo">
                <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Shillah Naigaga
                </Link>
            </h2>

            {/* Links on the right */}
            <div className="nav-links">
                <Link to="/" className="nav-link">HOME</Link>
                <Link to="/about" className="nav-link">ABOUT</Link>
                <Link to="/projects" className="nav-link">PROJECTS</Link>
            </div>
        </nav>
    );
};

export default Navbar;
