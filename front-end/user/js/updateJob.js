document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!token) {
        alert('Please Login.');
        window.location.href = 'login.html';
        return;
    }

    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const skillsInput = document.getElementById('required_skills');
    const salaryInput = document.getElementById('salary_range');
    const deadlineInput = document.getElementById('deadline');

    // Load job data
    try {
        const response = await fetch(`http://localhost:3000/api/v1/jobs/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (result.status === 'success') {
            const job = result.data.job;
            titleInput.value = job.title;
            descriptionInput.value = job.description;
            skillsInput.value = job.required_skills;
            salaryInput.value = job.salary_range;
            deadlineInput.value = new Date(job.deadline).toISOString().slice(0, 10);
        } else {
            alert(result.message.message);
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        alert('Error.');
    }

    // Handle form submission for updating job
    document.getElementById('updateJobForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const updatedJob = {
            title: titleInput.value,
            description: descriptionInput.value,
            required_skills: skillsInput.value,
            salary_range: salaryInput.value,
            deadline: deadlineInput.value,
        };

        try {
            const updateResponse = await fetch(`http://localhost:3000/api/v1/jobs/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedJob)
            });

            const updateResult = await updateResponse.json();

            if (updateResult.status === 'success') {
                alert('Job has been updated.');
                window.location.href = 'jobList.html'; 
            } else {
                alert(updateResult.message.message);
            }
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Error');
        }
    });
});
