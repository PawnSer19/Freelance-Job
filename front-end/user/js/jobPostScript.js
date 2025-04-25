document.getElementById('jobPostForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Please Login");
        window.location.href = "login.html";
        return;
    }

    const jobData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        required_skills: document.getElementById('required_skills').value,
        salary_range: document.getElementById('salary_range').value,
        deadline: document.getElementById('deadline').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/v1/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(jobData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            alert("Post Job succesfully");
            window.location.href = "homepage.html";
        } else {
            alert(result.data.message || "Fail to post job");
        }
    } catch (error) {
        console.error("Error posting job:", error);
        alert("Error");
    }
});
