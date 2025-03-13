import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const BlogForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  useEffect(() => {
    const fetchBlog = async () => {
      if (isEditMode) {
        try {
          const data = await api.getBlogById(id);
          setFormData({
            title: data.title,
            content: data.content,
          });
          setInitialLoading(false);
        } catch (error) {
          setError('Erreur lors du chargement du blog');
          setInitialLoading(false);
        }
      }
    };

    fetchBlog();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await api.updateBlog(id, formData);
        navigate(`/blogs/${id}`);
      } else {
        const response = await api.createBlog(formData);
        navigate(`/blogs/${response.id}`);
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="blog-form-container">
      <h2>{isEditMode ? 'Modifier le blog' : 'Créer un nouveau blog'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="blog-form">
        <div className="form-group">
          <label htmlFor="title">Titre</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Contenu</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(isEditMode ? `/blogs/${id}` : '/')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
