window.onload = async function() {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    // Kiểm tra đăng nhập
    if (!token) {
        alert("Please login.");
        window.location.href = "login.html"; 
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/jobs/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.status === 'success' && result.data && result.data.job ) {
            const job = result.data.job;
            // Hiển thị thông tin công việc
            document.getElementById('job-title').textContent = job.title;
            document.getElementById('job-description').textContent = job.description;
            document.getElementById('required-skills').textContent = job.required_skills;
            document.getElementById('salary-range').textContent = job.salary_range;
            document.getElementById('deadline').textContent = new Date(job.deadline).toLocaleDateString();
            document.getElementById('created-at').textContent = new Date(job.created_at).toLocaleDateString();
        } else {
            alert('Can not get Job');
        }
    } catch (error) {
        console.error('Error fetching job details:', error);
        alert('Error');
    }
};

document.getElementById('applyJobButton').addEventListener('click', async function () {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id'); 

    if (!token) {
        alert('Please Login.');
        window.location.href = 'login.html'; 
        return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const freelancer_id = String(decodedToken.id);

    const payload = {
        job_id: jobId, 
        freelancer_id: freelancer_id,
        application_date: new Date().toISOString(), 
        status: 'pending' 
    };
    try {
        const response = await fetch(`http://localhost:3000/api/v1/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert('Successfully applied!');
        } 
        else {
            alert('Application already exists');
        }
    } catch (error) {
        console.error('Error applying for job:', error);
        alert('Error.' +( error.message || error));
    }
});

