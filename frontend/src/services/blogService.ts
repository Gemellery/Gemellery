const API_BASE = 'http://localhost:5001/api';

export const fetchBlogs = async () => {
  const response = await fetch(`${API_BASE}/blogs`);
  if (!response.ok) throw new Error('Failed to fetch blogs');
  return response.json();
};

export const fetchBlogById = async (id: string) => {
  const response = await fetch(`${API_BASE}/blogs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch blog');
  return response.json();
};