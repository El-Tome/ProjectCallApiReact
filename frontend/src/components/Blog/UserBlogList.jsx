import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import BlogCard from './BlogCard';

const UserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserBlogs = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) {
          setError('Vous devez être connecté pour voir vos blogs');
          setLoading(false);
          return;
        }

        const data = await api.getUserBlogs();
        console.log("Blogs de l'utilisateur reçus de l'API:", data);
        
        // Traitement des données selon le format de réponse
        if (data && data.member && Array.isArray(data.member)) {
          setBlogs(data.member);
        } else if (Array.isArray(data)) {
          setBlogs(data);
        } else {
          setBlogs([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement de vos blogs:", error);
        setError('Erreur lors du chargement de vos blogs');
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, []);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1>Mes blogs</h1>
        <Link to="/blogs/new" className="btn btn-primary">
          Nouveau blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p>Vous n'avez pas encore créé de blog.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard 
              key={blog.id} 
              blog={blog} 
              showActions={true} // Afficher les actions sur cette page
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBlogList; 