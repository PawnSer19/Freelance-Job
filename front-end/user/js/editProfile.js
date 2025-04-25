async function loadUserProfile() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); 

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
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('phone').value = user.phone;
            document.getElementById('city').value = user.city;
            document.getElementById('specialization').value = user.specialization;
            document.getElementById('education_level').value = user.education_level;

            
            
        } else {
            alert('Error retrieving user information');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
}



document.getElementById('editProfileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); 

    if (!token || !userId) {
        alert("Please Login");
        return;
    }

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('phone', document.getElementById('phone').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('specialization', document.getElementById('specialization').value);
    formData.append('education_level', document.getElementById('education_level').value);

    const avatarInput = document.getElementById('avatar').files[0];
    if (avatarInput) {
        formData.append('avatar', avatarInput);
    }

    try {
        const response = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        });

        const result = await response.json();
        if (result.status === 'success') {
            alert("Updated information successfully");
            window.location.href = "userProfile.html"; 
        } else {
            alert('Failed to Update');
        }
    } catch (error) {
        console.error('Error updating user details:', error);
    }
});

document.addEventListener('DOMContentLoaded', loadUserProfile);

document.getElementById('avatar').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const preview = document.getElementById('avatarPreview');

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = ''; 
    }
});



