import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="blog-card">
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-meta">
        Par {blog.author?.firstname} {blog.author?.lastname} • {formatDate(blog.dateAdd)}
      </p>
      <p className="blog-excerpt">
        {blog.content.length > 150
          ? `${blog.content.substring(0, 150)}...`
          : blog.content}
      </p>
      <Link to={`/blogs/${blog.id}`} className="blog-link">
        Lire la suite
      </Link>
    </div>
  );
};

export default BlogCard;
