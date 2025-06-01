document.addEventListener('DOMContentLoaded', function() {
    // Elementy formularzy
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginFormDiv = document.querySelector('.login-form');
    const registerFormDiv = document.querySelector('.register-form');
    
    // Przełączanie między formularzami
    showRegisterLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginFormDiv.style.display = 'none';
        registerFormDiv.style.display = 'block';
    });

    showLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        registerFormDiv.style.display = 'none';
        loginFormDiv.style.display = 'block';
    });
    
    // Walidacja formularza logowania
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (validateLoginForm(email, password)) {
            // Sprawdzenie konkretnego użytkownika
            if (email === 'szymon@gmail.com' && password === 'szymon') {
                // Przekierowanie do formularza nowej waluty
                window.location.href = 'new-currency-signup.html';
            } else {
                showError('email', 'Nieprawidłowy email lub hasło');
            }
        }
    });
    
    // Walidacja formularza rejestracji
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;
        
        if (validateRegisterForm(firstName, lastName, phone, email, password, confirmPassword, terms)) {
            // Tutaj dodamy później logikę rejestracji
            console.log('Formularz rejestracji poprawny');
        }
    });
    
    // Funkcje walidacji
    function validateLoginForm(email, password) {
        let isValid = true;
        
        // Walidacja emaila
        if (!isValidEmail(email)) {
            showError('email', 'Podaj poprawny adres email');
            isValid = false;
        } else {
            removeError('email');
        }
        
        // Walidacja hasła
        if (password.length < 6) {
            showError('password', 'Hasło musi mieć minimum 6 znaków');
            isValid = false;
        } else {
            removeError('password');
        }
        
        return isValid;
    }
    
    function validateRegisterForm(firstName, lastName, phone, email, password, confirmPassword, terms) {
        let isValid = true;
        
        // Walidacja imienia
        if (firstName.length < 2) {
            showError('firstName', 'Imię musi mieć minimum 2 znaki');
            isValid = false;
        } else {
            removeError('firstName');
        }
        
        // Walidacja nazwiska
        if (lastName.length < 2) {
            showError('lastName', 'Nazwisko musi mieć minimum 2 znaki');
            isValid = false;
        } else {
            removeError('lastName');
        }
        
        // Walidacja telefonu
        if (!isValidPhone(phone)) {
            showError('phone', 'Podaj poprawny numer telefonu');
            isValid = false;
        } else {
            removeError('phone');
        }
        
        // Walidacja emaila
        if (!isValidEmail(email)) {
            showError('regEmail', 'Podaj poprawny adres email');
            isValid = false;
        } else {
            removeError('regEmail');
        }
        
        // Walidacja hasła
        if (password.length < 6) {
            showError('regPassword', 'Hasło musi mieć minimum 6 znaków');
            isValid = false;
        } else {
            removeError('regPassword');
        }
        
        // Walidacja potwierdzenia hasła
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Hasła nie są identyczne');
            isValid = false;
        } else {
            removeError('confirmPassword');
        }
        
        // Walidacja regulaminu
        if (!terms) {
            showError('terms', 'Musisz zaakceptować regulamin');
            isValid = false;
        } else {
            removeError('terms');
        }
        
        return isValid;
    }
    
    // Funkcje pomocnicze
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{9}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Usuń poprzedni komunikat błędu jeśli istnieje
        removeError(fieldId);
        
        // Dodaj nowy komunikat błędu
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    }
    
    function removeError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.classList.remove('error');
    }
}); 