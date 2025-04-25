document.getElementById('searchButton').addEventListener('click', async () => {
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (!searchTerm) {
        alert('Please enter job title.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/jobs/search?title=${encodeURIComponent(searchTerm)}`);
        const result = await response.json();

        if (result.status === 'success') {
            localStorage.setItem('searchResults', JSON.stringify(result.data.jobs));
            window.location.href = 'jobFind.html'; 
        } else {
            alert(result.message || 'Can not find.');
        }
    } catch (error) {
        console.error('Error searching for jobs:', error);
        alert('Error.');
    }
});
