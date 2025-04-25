document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('password', document.getElementById('password').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('city', document.getElementById('city').value);

    const avatarInput = document.getElementById('avatar');
    if(avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]);
    }

    try {
        const response = await fetch('http://localhost:3000/api/v1/users', { 
            method: 'POST',
            body: formData,
        });

        const result = await response.json();


        if (result.status === 'success') {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(result.message.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});
