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

function makeJobService() {
  const baseUrl = 'http://localhost:3000/api/v1/jobs';

  async function getAllJobs(page = 1, limit = 10) {
    const response = await efetch(`${baseUrl}?page=${page}&limit=${limit}`);
    return response;
  }

  async function deleteJobById(id) {
    return await efetch(`${baseUrl}/${id}`, { method: 'DELETE' });
  }

  async function findJobByTitle(title) {
    const response = await efetch(`${baseUrl}/search?title=${encodeURIComponent(title)}`);
    return response;
  }

  return {
    getAllJobs,
    deleteJobById,
    findJobByTitle
  };
}

export default makeJobService;
