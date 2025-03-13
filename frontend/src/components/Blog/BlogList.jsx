import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import BlogCard from './BlogCard';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await api.getBlogs();
        setBlogs(data['hydra:member'] || data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement des blogs');
        setLoading(false);
      }
    };

    fetchBlogs();
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
        <h1>Liste des blogs</h1>
        {localStorage.getItem('jwt') && (
          <Link to="/blogs/new" className="btn btn-primary">
            Nouveau blog
          </Link>
        )}
      </div>

      {blogs.length === 0 ? (
        <p>Aucun blog disponible pour le moment.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
