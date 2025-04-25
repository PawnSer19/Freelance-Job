document.addEventListener('DOMContentLoaded', async function () {

    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    
    if (!jobId) {
        alert('No job found.');
        window.location.href = 'jobList.html';
        return;
    }


    if (!token) {
        alert('Please log in');
        window.location.href = 'login.html';
        return;
    }


    if (!jobId) {
        alert('No job found.');
        window.location.href = 'jobList.html';
        return;
    }

    const applicationList = document.getElementById('applicationList');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/applications/job/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();


        if (result.status === 'success') {
            const applications = result.data.applications;
            applicationList.innerHTML = '';

            applications.forEach(application => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = application.name;
                nameCell.classList.add('name-hover');
                nameCell.addEventListener('click', () => {
                    console.log('freeId',application.freelancer_id);
                    window.location.href = `userProfile.html?id=${application.freelancer_id}`;
                })
                
                row.appendChild(nameCell);

                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(application.application_date).toLocaleDateString();
                row.appendChild(dateCell);

                const statusCell = document.createElement('td');
                const statusSelect = document.createElement('select');
                statusSelect.classList.add('form-select');
                ['pending', 'approved', 'rejected'].forEach(status => {
                    const option = document.createElement('option');
                    option.value = status;
                    option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
                    if (application.status === status) option.selected = true;
                    statusSelect.appendChild(option);
                });
                statusCell.appendChild(statusSelect);
                row.appendChild(statusCell);

                const actionCell = document.createElement('td');
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.classList.add('btn', 'btn-primary');
                updateButton.addEventListener('click', async () => {
                    const newStatus = statusSelect.value;
                    try {
                        const updateResponse = await fetch(`http://localhost:3000/api/v1/applications/${application.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ status: newStatus })
                        });
                        const updateResult = await updateResponse.json();

                        if (updateResult.status === 'success') {
                            alert('The application status has been updated successfully.');
                        } else {
                            alert('Unable to update application status.');
                        }
                    } catch (error) {
                        console.error('Error updating application status:', error);
                        alert('An error occurred while updating the application status.');
                    }
                });

                actionCell.appendChild(updateButton);
                row.appendChild(actionCell);

                applicationList.appendChild(row);
            });
        } else {
            alert('Unable to load application list.');
        }
    } catch (error) {
        console.error('Error fetching applications:', error);
        alert('An error occurred while loading the application list.');
    }
});
