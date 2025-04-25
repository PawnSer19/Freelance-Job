window.onload = function() {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    console.log('DOM fully loaded and parsed');
    
    const userNameElement = document.getElementById('user-name');
    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    
    if (token && userName) {

        console.log('user logged in');
        
        userNameElement.textContent = `${userName}`;
        userNameElement.style.display = 'inline';
        dropdownButton.style.display = 'inline';

        loginLink.style.display = 'none';
        registerLink.style.display = 'none';
    } else {

        console.log('user not logged in');
        
        userNameElement.style.display = 'none';
        dropdownButton.style.display = 'none';
        dropdownMenu.style.display = 'none';

        loginLink.style.display = 'inline';
        registerLink.style.display = 'inline';
    }
};

document.getElementById('dropdownMenuButton')?.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu) {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    }
    event.stopPropagation(); 
});

window.addEventListener('click', function(event) {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu && dropdownMenu.style.display === 'block' && !event.target.closest('#dropdownMenuButton')) {
        dropdownMenu.style.display = 'none';
    }
});

document.getElementById('logoutButton')?.addEventListener('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');

    alert('Log out Success');
    window.location.href = "homepage.html"; 
});
