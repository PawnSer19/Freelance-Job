document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`http://localhost:3000/api/v1/applications/freelancer`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            const applications = result.data.applications;

            let applicationsList = document.getElementById('applicationsList');
            applicationsList.innerHTML = ''; 

            applications.forEach(application => {
                const formattedDate = moment(application.application_date).format('DD-MM-YYYY');

                let row = document.createElement('tr');
                
                let jobIdCell = document.createElement('td');
                jobIdCell.textContent = application.job_id;

                let statusCell = document.createElement('td');
                statusCell.textContent = application.status;

                let dateCell = document.createElement('td');
                dateCell.textContent = formattedDate;

                let actionCell = document.createElement('td');
                let deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/api/v1/applications/${application.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (!deleteResponse.ok) {
                            throw new Error('Delete failed');
                        }

                        const deleteResult = await deleteResponse.json();

                        if (deleteResult.status === 'success') {
                            alert('Delete Successful');
                            row.remove();
                        } else {
                            alert('Can not delete');
                        }
                    } catch (error) {
                        console.error('Error deleting application:', error);
                        alert('An error occurred while deleting the job.');
                    }
                });

                actionCell.appendChild(deleteButton);

                row.appendChild(jobIdCell);
                row.appendChild(statusCell);
                row.appendChild(dateCell);
                row.appendChild(actionCell);

                applicationsList.appendChild(row);
            });
        } else {
            alert('Unable to load applied jobs.');
        }
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        alert('There was an error loading applied jobs.');
    }
});
