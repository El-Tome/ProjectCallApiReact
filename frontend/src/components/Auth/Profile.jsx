import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaKey } from 'react-icons/fa';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    password: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Charger les informations du profil
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          navigate('/login');
          return;
        }

        const data = await api.getUserProfile();
        setUserProfile(data);
        setFormData({
          email: data.email || '',
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          password: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setError('Erreur lors du chargement de votre profil');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Ne pas envoyer le mot de passe s'il est vide
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      const response = await api.updateUserProfile(dataToSend);
      setUserProfile(response);
      setIsEditing(false);
      setSuccess('Votre profil a été mis à jour avec succès');
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      setError('Erreur lors de la mise à jour de votre profil');
      setLoading(false);
    }
  };

  if (loading && !userProfile) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon Profil</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!isEditing ? (
        <div className="profile-info-container">
          <div className="profile-info">
            <div className="profile-info-item">
              <FaUser className="profile-icon" />
              <div>
                <h3>Nom complet</h3>
                <p>{userProfile?.firstname} {userProfile?.lastname}</p>
              </div>
            </div>
            <div className="profile-info-item">
              <FaEnvelope className="profile-icon" />
              <div>
                <h3>Email</h3>
                <p>{userProfile?.email}</p>
              </div>
            </div>
          </div>
          <button 
            className="btn btn-primary profile-edit-btn"
            onClick={() => setIsEditing(true)}
          >
            Modifier mon profil
          </button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="firstname">Prénom</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Nom</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe (optionnel)</label>
            <div className="input-with-icon">
              <FaKey className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Laissez vide pour ne pas changer"
              />
            </div>
          </div>
          <div className="profile-form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile; 