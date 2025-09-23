const BASE_URL = 'https://flavornest.onrender.com';

export async function fetchRecipes() {
  const res = await fetch(`${BASE_URL}/recipes`);
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
}

export async function fetchRecipe(slug) {
  const res = await fetch(`${BASE_URL}/recipes/${slug}`);
  if (!res.ok) throw new Error('Recipe not found');
  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

// Like, save, comments
export async function likeRecipe(slug, token) {
  await fetch(`${BASE_URL}/recipes/${slug}/like`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function saveRecipe(recipeId, token) {
  await fetch(`${BASE_URL}/users/me/save/${recipeId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}
