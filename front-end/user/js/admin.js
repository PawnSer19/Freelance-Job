const API_BASE_URL = "http://localhost:3000"; // Update if necessary

// Register User
document.getElementById("register").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData();
  formData.append("name", document.getElementById("name").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("password", document.getElementById("password").value);
  formData.append("phone", document.getElementById("phone").value);
  formData.append("city", document.getElementById("city").value);
  if (document.getElementById("avatar").files[0]) {
    formData.append("avatar", document.getElementById("avatar").files[0]);
  }

  
  const role = 'user'; 
  formData.append("role", role);

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (data.status === "success") {
    document.getElementById("register-message").textContent = "Registered successfully!";
  } else {
    document.getElementById("register-message").textContent = data.message.message || "Registration failed!";
  }
});

// Login User
document.getElementById("login").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const response = await fetch(`${API_BASE_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.status === "success") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role); 

    if (data.role === 'admin') {
      window.location.href = 'adminPage.html'; 
    } else {
      window.location.href = 'homepage.html'; 
    }
  } else {
    document.getElementById("login-message").textContent = data.message.message || "Login failed!";
  }
});

// Show Profile
function showProfile(profile) {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("profile").style.display = "block";

  document.getElementById("profile-name").textContent = profile.name;
  document.getElementById("profile-email").textContent = profile.email;
  document.getElementById("profile-phone").textContent = profile.phone;
  document.getElementById("profile-city").textContent = profile.city;
}

// Logout User
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  location.reload();
});
