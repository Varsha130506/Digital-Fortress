// Password strength validation
document.getElementById('password')?.addEventListener('input', function(e) {
  const password = e.target.value;
  const length = document.getElementById('length');
  const uppercase = document.getElementById('uppercase');
  const number = document.getElementById('number');

  // Check password length
  if (password.length >= 8) {
    length.classList.add('bg-green-500', 'border-green-500');
    length.classList.remove('border-gray-300');
  } else {
    length.classList.remove('bg-green-500', 'border-green-500');
    length.classList.add('border-gray-300');
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    uppercase.classList.add('bg-green-500', 'border-green-500');
    uppercase.classList.remove('border-gray-300');
  } else {
    uppercase.classList.remove('bg-green-500', 'border-green-500');
    uppercase.classList.add('border-gray-300');
  }

  // Check for numbers
  if (/\d/.test(password)) {
    number.classList.add('bg-green-500', 'border-green-500');
    number.classList.remove('border-gray-300');
  } else {
    number.classList.remove('bg-green-500', 'border-green-500');
    number.classList.add('border-gray-300');
  }
});

// Form validation for signup
document.getElementById('signupForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;

  // Password match validation
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }

  // Terms agreement validation
  if (!terms) {
    alert('You must agree to the terms and conditions');
    return;
  }

  // Password strength validation
  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    alert('Password does not meet security requirements');
    return;
  }

  // If all validations pass
  alert('Account created successfully!');
  window.location.href = 'index.html';
});

// Form validation for login
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // In a real app, this would validate against a backend
  localStorage.setItem('authToken', 'loggedIn');
  window.location.href = 'dashboard.html';
});

// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  if(window.location.pathname.includes('dashboard.html') && !localStorage.getItem('authToken')) {
    window.location.href = 'index.html';
    return;
  }

  // Load saved data if exists
  const savedData = localStorage.getItem('userSafetyData');
  if(savedData && document.getElementById('safetyForm')) {
    const data = JSON.parse(savedData);
    for(const [key, value] of Object.entries(data)) {
      const input = document.querySelector(`[name="${key}"]`);
      if(input) input.value = value;
    }
    calculateSafetyScore(data);
  }

  // Handle safety form submission
  document.getElementById('safetyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    localStorage.setItem('userSafetyData', JSON.stringify(data));
    calculateSafetyScore(data);
    alert('Safety profile updated successfully!');
  });
});

function calculateSafetyScore(data) {
  let score = 0;
  
  // Social media presence (lower is better)
  if(data.twitter) score -= 5;
  if(data.instagram) score -= 5;
  
  // Password practices
  if(data.passwordReuse === 'never') score += 30;
  else if(data.passwordReuse === 'sometimes') score += 15;
  
  // 2FA usage
  if(data.twoFactor === 'enabled') score += 30;
  else if(data.twoFactor === 'some') score += 15;
  
  // Cap score between 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Update UI
  const scoreCard = document.getElementById('scoreCard');
  const scoreValue = document.getElementById('scoreValue');
  const scoreCircle = document.getElementById('scoreCircle');
  const recommendations = document.getElementById('recommendations');
  
  if(scoreCard && scoreValue && scoreCircle && recommendations) {
    scoreCard.classList.remove('hidden');
    scoreValue.textContent = `${score}%`;
    scoreCircle.setAttribute('stroke-dasharray', `${score},100`);
    
    // Generate recommendations
    recommendations.innerHTML = '';
    if(score < 50) {
      recommendations.innerHTML += '<div class="p-3 bg-red-100 text-red-800 rounded"><i class="fas fa-exclamation-triangle mr-2"></i> High Risk: Please enable 2FA and stop password reuse immediately</div>';
    }
    if(data.passwordReuse !== 'never') {
      recommendations.innerHTML += '<div class="p-3 bg-yellow-100 text-yellow-800 rounded"><i class="fas fa-key mr-2"></i> Use unique passwords for each account</div>';
    }
    if(data.twoFactor !== 'enabled') {
      recommendations.innerHTML += '<div class="p-3 bg-yellow-100 text-yellow-800 rounded"><i class="fas fa-lock mr-2"></i> Enable two-factor authentication on all accounts</div>';
    }
    if(score > 70) {
      recommendations.innerHTML += '<div class="p-3 bg-green-100 text-green-800 rounded"><i class="fas fa-check-circle mr-2"></i> Good security practices detected!</div>';
    }
  }
  
  return score;
}
