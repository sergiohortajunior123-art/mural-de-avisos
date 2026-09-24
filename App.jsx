import { useEffect, useState } from 'react';
import FormularioAviso from './components/FormularioAviso';
import ListaAvisos from './components/ListaAvisos';
import './App.css';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const emptyForm = { title: '', body: '' };

export default function App() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingPost, setEditingPost] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setIsLoading(true);
      setLoadError(false);

      try {
        const response = await fetch(`${API_URL}?_limit=15`, { signal: controller.signal });
        if (!response.ok) throw new Error('Resposta inválida da API');
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== 'AbortError') setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadPosts();
    return () => controller.abort();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(post) {
    setEditingPost(post);
    setForm({ title: post.title, body: post.body });
    setFormError('');
  }

  function cancelEdit() {
    setEditingPost(null);
    setForm(emptyForm);
    setFormError('');
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.body.trim()) {
      setFormError('Preencha o título e o texto antes de publicar.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (!editingPost) {
        await createPost();
      } else {
        await updatePost(editingPost.id);
      }
    } catch (err) {
      setFormError(err.message || 'Não foi possível salvar o aviso.');
    } finally {
      setIsSaving(false);
    }
  }

  async function createPost() {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, title: form.title, body: form.body }),
    });

    if (response.status !== 201) throw new Error('Não foi possível publicar o aviso.');

    const created = await response.json();
    const newPost = { ...created, id: created.id ?? Date.now() };

    setPosts((prev) => [newPost, ...prev]);
    setForm(emptyForm);
  }

  async function updatePost(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, title: form.title, body: form.body }),
    });

    if (!response.ok) throw new Error('Não foi possível salvar as alterações.');

    const updated = await response.json();
    setPosts((prev) => prev.map((post) => (post.id === id ? { ...post, ...updated, id } : post)));
    cancelEdit();
  }

  async function handleDelete(id) {
    const previousPosts = posts;
    setPosts((prev) => prev.filter((post) => post.id !== id));

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error();
    } catch {
      setPosts(previousPosts);
    }

    if (editingPost?.id === id) cancelEdit();
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mural de avisos</h1>
      </header>

      <main className="app-main">
        <FormularioAviso
          form={form}
          onChange={updateField}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
          isEditing={Boolean(editingPost)}
          isSaving={isSaving}
          error={formError}
        />

        <ListaAvisos
          posts={posts}
          isLoading={isLoading}
          loadError={loadError}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </main>

      <footer className="app-footer">
        Vite + React · fetch GET/POST/PUT/DELETE · jsonplaceholder.typicode.com/posts
      </footer>
    </div>
  );
}
