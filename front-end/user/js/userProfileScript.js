async function loadUserProfile() {
    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const freelancerId = urlParams.get('id');
    const userId = freelancerId || localStorage.getItem('userId');

    console.log(freelancerId);  // Kiểm tra freelancerId lấy từ URL
    console.log(userId);    
    console.log(localStorage.getItem('token'));  // Kiểm tra token
    console.log(localStorage.getItem('userId'));

    if (!token || !userId) {
        alert("Please Login.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (result.status === 'success') {
            const user = result.data.userProfile;
            document.getElementById('name').textContent = user.name;
            document.getElementById('email').textContent = user.email;
            document.getElementById('phone').textContent = user.phone;
            document.getElementById('city').textContent = user.city;
            document.getElementById('specialization').textContent = user.specialization;
            document.getElementById('education_level').textContent = user.education_level;

            if (user.avatar) {
                const link = document.getElementById('avatar').src = `http://localhost:3000${user.avatar.replace(/\\/g, '/')}`;
                console.log('link',link);
                document.getElementById('avatar').alt = `${user.name}'s Avatar`;
            } else {
                document.getElementById('avatar').src = 'images/images.jpg'; 
                document.getElementById('avatar').alt = 'Default Avatar';
            }
        } else {
            alert(result.data.message || 'Error');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}


document.addEventListener('DOMContentLoaded', loadUserProfile);

