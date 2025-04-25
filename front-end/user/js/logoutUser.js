function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');

    window.location.href = "login.html";  
}

document.getElementById('logoutButton').addEventListener('click', logoutUser);
