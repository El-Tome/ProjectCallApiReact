import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Composants Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/common/PrivateRoute';

// Composants Auth
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Composants Blog
import BlogList from './components/Blog/BlogList';
import BlogDetail from './components/Blog/BlogDetail';
import BlogForm from './components/Blog/BlogForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          
          {/* Routes protégées */}
          <Route element={<PrivateRoute />}>
            <Route path="/blogs/new" element={<BlogForm />} />
            <Route path="/blogs/:id/edit" element={<BlogForm />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
