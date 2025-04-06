import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import checkIsAdmin from '../../services/checkIsAdmin';
import { api } from '../../services/api';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const isAdmin = checkIsAdmin();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        // Ajouter un identifiant unique car tous les utilisateurs ont le même @id
        const usersWithUniqueIds = data.member.map((user, index) => ({
          ...user,
          uniqueId: index // utiliser l'index comme identifiant unique
        }));
        setUsers(usersWithUniqueIds || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userEmail, index) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userEmail} ?`)) {
      try {
        // Utiliser l'email comme identifiant pour la suppression
        await api.deleteUser(userEmail);
        
        // Mettre à jour la liste des utilisateurs après la suppression
        setUsers(users.filter((_, i) => i !== index));
        
        // Si l'utilisateur sélectionné a été supprimé, désélectionner
        if (selectedUser && selectedUser.uniqueId === index) {
          setSelectedUser(null);
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleSelectUser = (user) => {
    // Sélectionner ou désélectionner l'utilisateur
    setSelectedUser(selectedUser && selectedUser.uniqueId === user.uniqueId ? null : user);
  };

  // Rediriger si l'utilisateur n'est pas admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="loading">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-container">
      <h1>Administration des Utilisateurs</h1>
      
      <div className="user-admin-table">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Rôles</th>
              <th>Blogs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.uniqueId} 
                className={selectedUser && selectedUser.uniqueId === user.uniqueId ? "selected-row" : ""}
                onClick={() => handleSelectUser(user)}
              >
                <td>{user.email}</td>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.roles.join(', ')}</td>
                <td>{user.blogs.length}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      e.stopPropagation(); // Empêcher le clic sur la ligne
                      handleDeleteUser(user.email, user.uniqueId);
                    }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="user-blogs-section">
          <h2>Blogs de {selectedUser.firstname} {selectedUser.lastname}</h2>
          {selectedUser.blogs.length === 0 ? (
            <p>Cet utilisateur n'a pas encore créé de blogs.</p>
          ) : (
            <div className="blog-grid">
              {selectedUser.blogs.map(blog => (
                <div key={blog.id} className="blog-card">
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-meta">ID: {blog.id}</p>
                  <p className="blog-excerpt">{blog.content.substring(0, 100)}...</p>
                  <p className="blog-meta">
                    Créé le: {new Date(blog.dateAdd).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .selected-row {
          background-color: #e3f2fd;
        }
        
        .user-blogs-section {
          margin-top: 30px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .user-blogs-section h2 {
          margin-bottom: 20px;
          color: #333;
        }
        
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
      `}</style>
    </div>
  );
};

export default UserAdmin; 