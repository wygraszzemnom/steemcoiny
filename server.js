const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const ADMIN_EMAIL = 'admin@steamcoin.pl'; // Twój adres email

// Middleware
app.use(cors());
app.use(express.json());

// Konfiguracja nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'twoj-email@gmail.com', // Twój email Gmail
        pass: 'twoje-haslo-aplikacji' // Hasło aplikacji Gmail
    }
});

// Endpoint do rejestracji
app.post('/api/register', async (req, res) => {
    try {
        const userData = req.body;
        
        // Przygotowanie treści emaila
        const emailContent = `
            Nowa rejestracja w SteamCoin!
            
            Dane użytkownika:
            Kwota inwestycji: ${userData.investmentAmount} PLN
            Metoda płatności: ${userData.paymentMethod}
            Adres portfela: ${userData.walletAddress}
            
            Tokeny:
            Podstawowe: ${userData.tokens}
            Bonus: ${userData.bonusTokens}
            
            Powiadomienia:
            - Aktualizacje cen: ${userData.notifications.priceUpdates ? 'Tak' : 'Nie'}
            - Wiadomości: ${userData.notifications.newsUpdates ? 'Tak' : 'Nie'}
            - Analizy rynkowe: ${userData.notifications.marketUpdates ? 'Tak' : 'Nie'}
            
            Data rejestracji: ${userData.timestamp}
            IP: ${userData.ipAddress}
            Przeglądarka: ${userData.userAgent}
        `;

        // Wysłanie emaila
        await transporter.sendMail({
            from: 'steamcoin@twoja-domena.pl',
            to: ADMIN_EMAIL,
            subject: 'Nowa rejestracja SteamCoin',
            text: emailContent
        });

        // Zapisanie danych do pliku (opcjonalnie)
        const registrations = JSON.parse(fs.readFileSync('registrations.json', 'utf8') || '[]');
        registrations.push(userData);
        fs.writeFileSync('registrations.json', JSON.stringify(registrations, null, 2));

        res.json({ success: true, message: 'Rejestracja zakończona sukcesem' });
    } catch (error) {
        console.error('Błąd podczas rejestracji:', error);
        res.status(500).json({ success: false, message: 'Wystąpił błąd podczas rejestracji' });
    }
});

// Uruchomienie serwera
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
}); 