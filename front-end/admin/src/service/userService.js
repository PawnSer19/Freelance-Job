async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message || 'Unknown error');
  }
  return json.data;
}

function makeUserService() {
  const baseUrl = 'http://localhost:3000/api/v1/users';

  async function getAllUsers(page = 1, limit = 10) {
    const response = await  efetch(`${baseUrl}?page=${page}&limit=${limit}`);
    return response.result;
  }

  async function deleteUserById(id) {
    return await efetch(`${baseUrl}/${id}`, { method: 'DELETE' });
  }

  async function findUserByName(name) {
  const response = await efetch(`${baseUrl}/search?name=${encodeURIComponent(name)}`);
  return response; 
}

  return {
    getAllUsers,
    deleteUserById,
    findUserByName
  };
}

export default makeUserService;
