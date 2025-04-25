async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.status === "success") {
            const userProfile = result.data.userProfile;

            if (userProfile) {
                
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('userName', userProfile.name);
                localStorage.setItem('userId', result.data.user.id);

                alert(result.data.message);
                window.location.href = "homepage.html";  

                setInterval(checkTokenExpiration, 1000 * 60 * 60);
            } else {
                alert('User profile is not available.');
            }
        } else if (result.status === "error" ) {
            alert('Email or Password is incorrect');
        } else {
            console.error('Error response:', result);
            alert('Unexpected error occurred.');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

document.getElementById('loginButton').addEventListener('click', (e) => {
    e.preventDefault();
    loginUser();
});
