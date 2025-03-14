import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
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
      <Link to={`/blogs/${blog.id}`} className="blog-link">
        Lire la suite
      </Link>
    </div>
  );
};

export default BlogCard;
