import React, { useEffect, useRef, useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function RecipeUpload() {
  const [form, setForm] = useState({ title:'', short:'', ingredients:'', steps:'', prep:10, cook:10, tags:'' });
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // load draft
  useEffect(()=> {
    const d = localStorage.getItem('flavornest_draft');
    if (d) setForm(JSON.parse(d));
  }, []);

  // auto-save draft
  useEffect(()=> {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(()=> {
      const c = { ...form };
      localStorage.setItem('flavornest_draft', JSON.stringify(c));
    }, 700);
    return ()=> clearTimeout(timerRef.current);
  }, [form]);

  const onFiles = (e) => setFiles(Array.from(e.target.files));

  async function submit(e) {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k,v]) => data.append(k, v));
      files.forEach(f => data.append('photos', f));
      await API.post('/recipes', data);
      localStorage.removeItem('flavornest_draft');
      alert('Uploaded');
      navigate('/');
    } catch (err) {
      alert('Upload failed – login required');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold mb-4">Upload Recipe</h2>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Recipe title" className="w-full p-2 border rounded" required />
        <input value={form.short} onChange={e=>setForm({...form, short:e.target.value})} placeholder="Short description" className="w-full p-2 border rounded" />
        <textarea value={form.ingredients} onChange={e=>setForm({...form, ingredients:e.target.value})} placeholder="Ingredients (one per line)" className="w-full p-2 border rounded h-28" />
        <textarea value={form.steps} onChange={e=>setForm({...form, steps:e.target.value})} placeholder="Steps (one per line)" className="w-full p-2 border rounded h-40" />
        <div className="flex gap-2">
          <input type="number" value={form.prep} onChange={e=>setForm({...form, prep:e.target.value})} placeholder="Prep min" className="w-28 p-2 border rounded" />
          <input type="number" value={form.cook} onChange={e=>setForm({...form, cook:e.target.value})} placeholder="Cook min" className="w-28 p-2 border rounded" />
        </div>
        <input value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} placeholder="Tags (comma separated)" className="w-full p-2 border rounded" />
        <input type="file" multiple onChange={onFiles} />
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Upload</button>
          <button type="button" onClick={()=>{ localStorage.removeItem('flavornest_draft'); setForm({ title:'', short:'', ingredients:'', steps:'', prep:10, cook:10, tags:''}); }} className="px-4 py-2 border rounded">Clear Draft</button>
        </div>
      </form>
    </div>
  );
}
