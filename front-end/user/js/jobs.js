let currentPage = 1;
const limit = 10;

async function fetchJobs(page = 1) {
    try {
        const response = await fetch(`http://localhost:3000/api/v1/jobs?page=${page}&limit=${limit}`); 
        const data = await response.json();

        const jobs = data.data.jobs;
        const pagination = data.data.pagination;
        
        const jobListContainer = document.getElementById('job-list');
        jobListContainer.innerHTML = ''; 
        
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
                        <a href="jobDetail.html?id=${job.id}" class="post-job-btn view-details">View Details</a>
                    </div>
                     <div class="card-footer text-muted">
                        <small>Posted by Employer ID: ${job.employer_id}</small><br>
                        <small>Created at: ${formattedCreatedAt}</small>
                    </div>
                </div>
            `;
            
            jobListContainer.appendChild(jobCard);
        });

        updatePaginaton(pagination);
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

function updatePaginaton(pagination) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= pagination.totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        if (i === pagination.currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchJobs(currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', () => fetchJobs(currentPage));


