import { Link, useNavigate } from 'react-router-dom';
import checkIsAdmin from '../../services/checkIsAdmin';

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('jwt') !== null;

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };
  const isAdmin = checkIsAdmin();

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Blog App</Link>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Accueil</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/blogs/new" className="nav-link">Nouveau Blog</Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-blogs" className="nav-link">Mes Blogs</Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin/users" className="nav-link">Administration</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="nav-link btn-link">
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Connexion</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Inscription</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 