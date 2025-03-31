import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const BlogCard = ({ blog, showActions = false }) => {
  // Vérifier que blog existe
  if (!blog) return null;

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Extraire un extrait du contenu avec vérification
  const getContentExcerpt = () => {
    if (!blog.content) return 'Aucun contenu';
    return blog.content.length > 150
      ? `${blog.content.substring(0, 150)}...`
      : blog.content;
  };

  return (
    <div className="blog-card">
      <h3 className="blog-title">{blog.title || 'Sans titre'}</h3>
      <p className="blog-meta">
        Par {blog.author?.lastname || 'Auteur inconnu'} • 
        {formatDate(blog.dateAdd)}
      </p>
      <p className="blog-excerpt">
        {getContentExcerpt()}
      </p>
      <div className="blog-card-actions">
        <Link 
          to={`/blogs/${blog.id}`} 
          state={{ from: showActions ? '/my-blogs' : '/' }}
          className="blog-link"
        >
          <FaEye style={{ marginRight: '5px' }} /> Lire
        </Link>
        
        {showActions && (
          <>
            <Link 
              to={`/blogs/${blog.id}/edit`}
              className="blog-edit-link"
            >
              <FaEdit style={{ marginRight: '5px' }} /> Modifier
            </Link>
            <Link 
              to={`/blogs/${blog.id}`} 
              state={{ from: '/my-blogs' }}
              className="blog-delete-link"
            >
              <FaTrash style={{ marginRight: '5px' }} /> Supprimer
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
