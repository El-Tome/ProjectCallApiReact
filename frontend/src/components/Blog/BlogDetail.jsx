import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifie si on vient de la page "Mes Blogs"
  const isFromMyBlogsPage = location.state?.from === '/my-blogs';

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await api.getBlogById(id);
        setBlog(data);
        setLoading(false);
      } catch (error) {
        setError('Erreur lors du chargement du blog');
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) {
      try {
        await api.deleteBlog(id);
        navigate(isFromMyBlogsPage ? '/my-blogs' : '/');
      } catch (error) {
        setError('Erreur lors de la suppression du blog');
      }
    }
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!blog) {
    return <div className="not-found">Blog non trouvé</div>;
  }

  // Vérifie si l'utilisateur est l'auteur du blog
  const token = localStorage.getItem('jwt');
  const isAuthor = token && blog.author; // Simplifié pour l'exemple

  return (
    <div className="blog-detail-container">
      <Link to={location.state?.from || "/"} className="back-link">
        <FaArrowLeft style={{ marginRight: '8px' }} /> Retour
      </Link>

      <article className="blog-detail">
        <h1 className="blog-title">{blog.title}</h1>
        
        <div className="blog-meta">
          Par {blog.author?.firstname} {blog.author?.lastname} • {formatDate(blog.dateAdd)}
          {blog.dateUpdate && blog.dateUpdate !== blog.dateAdd && 
            ` • Mis à jour le ${formatDate(blog.dateUpdate)}`}
        </div>
        
        <div className="blog-content">
          {blog.content}
        </div>
        
        {isAuthor && isFromMyBlogsPage && (
          <div className="blog-actions">
            <Link to={`/blogs/${blog.id}/edit`} className="btn-edit">
              <FaEdit style={{ marginRight: '8px' }} /> Modifier
            </Link>
            <button onClick={handleDelete} className="btn-delete">
              <FaTrash style={{ marginRight: '8px' }} /> Supprimer
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetail; 