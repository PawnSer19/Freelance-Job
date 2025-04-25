document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please Log in.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/jobs/employer', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (result.status === 'success') {
            const jobs = result.data.job; 
            const jobList = document.getElementById('ListJob');
            jobList.innerHTML = '';

            jobs.forEach(job => {
                const row = document.createElement('tr');

                const titleCell = document.createElement('td');
                titleCell.textContent = job.title;
                row.appendChild(titleCell);

                const actionCell = document.createElement('td');

                const updateButton = document.createElement('a');
                updateButton.href = `jobUpdate.html?id=${job.id}`;
                updateButton.textContent = 'Update';
                updateButton.classList.add('btn', 'btn-secondary', 'me-2');
                actionCell.appendChild(updateButton);

                const checkButton = document.createElement('a');
                checkButton.href = `applicationUpdate.html?jobId=${job.id}`;
                checkButton.textContent = 'Check';
                checkButton.classList.add('btn', 'btn-info', 'me-2');
                actionCell.appendChild(checkButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/api/v1/jobs/${job.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const deleteResult = await deleteResponse.json();

                        if (deleteResult.status === 'success') {
                            alert('Job has been deleted.');
                            row.remove();
                        } else {
                            alert(deleteResult.message || 'Can not delete.');
                        }
                    } catch (error) {
                        console.error('Error deleting job:', error);
                        alert('Error.');
                    }
                });

                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);
                jobList.appendChild(row);
            });
        } else {
            alert(result.message || 'Can not load job list.');
        }
    } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('Error fetching jobs.');
    }
});
