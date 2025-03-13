import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        navigate('/');
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

  // Vérifier si l'utilisateur est connecté et est l'auteur du blog
  const token = localStorage.getItem('jwt');
  // Note: Dans une application réelle, vous devriez décoder le token pour vérifier l'ID de l'utilisateur
  // et le comparer avec l'ID de l'auteur du blog
  const isAuthor = token && blog.author; // Simplifié pour l'exemple

  return (
    <div className="blog-detail-container">
      <Link to="/" className="back-link">
        &larr; Retour à la liste
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
        
        {isAuthor && (
          <div className="blog-actions">
            <Link to={`/blogs/${blog.id}/edit`} className="btn btn-edit">
              Modifier
            </Link>
            <button onClick={handleDelete} className="btn btn-delete">
              Supprimer
            </button>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetail; 