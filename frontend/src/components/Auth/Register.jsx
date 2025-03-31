import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstname: '',
    lastname: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Étape 1: Inscription de l'utilisateur
      const registerResponse = await api.register(formData);
      
      if (registerResponse.success) {
        // Étape 2: Si l'inscription est réussie, connecter l'utilisateur automatiquement
        try {
          const loginResponse = await api.login({
            email: formData.email,
            password: formData.password
          });
          
          if (loginResponse.token) {
            // Stocker le token et rediriger vers la page d'accueil
            localStorage.setItem('jwt', loginResponse.token);
            navigate('/');
          } else {
            // Si la connexion automatique échoue, rediriger vers la page de connexion
            navigate('/login', { 
              state: { 
                message: 'Inscription réussie ! Veuillez vous connecter avec vos identifiants.' 
              } 
            });
          }
        } catch (loginError) {
          // En cas d'erreur de connexion, rediriger vers la page de connexion
          navigate('/login', { 
            state: { 
              message: 'Inscription réussie ! Veuillez vous connecter avec vos identifiants.' 
            } 
          });
        }
      } else {
        setError(registerResponse.message || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error) {
      setError('Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Inscription</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">Prénom</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Nom</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>
        <p className="auth-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
