document.addEventListener('DOMContentLoaded', () => {
    const jobs = JSON.parse(localStorage.getItem('searchResults'));
    const jobListContainer = document.getElementById('job-list');
    jobListContainer.innerHTML = ''; 

    if (!jobs || jobs.length === 0) {
        jobListContainer.innerHTML = '<p>No result.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('col-md-4', 'mb-4');
        
        const formattedDeadline = moment(job.deadline).format('DD-MM-YYYY');
        const formattedCreatedAt = moment(job.created_at).format('DD-MM-YYYY');

        jobCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${job.title}</h5>
                    <p><strong>Required Skills:</strong> ${job.required_skills}</p>
                    <p><strong>Salary Range:</strong> ${job.salary_range}</p>
                    <p><strong>Deadline:</strong> ${formattedDeadline}</p>
                    <a href="jobDetail.html?id=${job.id}" class="btn btn-primary view-details">View Details</a>
                </div>
                <div class="card-footer text-muted">
                    <small>Posted by Employer ID: ${job.employer_id}</small><br>
                    <small>Created at: ${formattedCreatedAt}</small>
                </div>
            </div>
        `;
        
        jobListContainer.appendChild(jobCard);
    });
});
