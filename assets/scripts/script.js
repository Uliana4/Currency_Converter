// Обработчик формы 1
// Funkcja do pobierania kursów walut z API NBP
document.getElementById('fetchRates').addEventListener('click', function() {
    const url = "https://api.exchangerate-api.com/v4/latest/PLN"; // Пример API для курсов валют
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const usdRate = data.rates.USD;
            const eurRate = data.rates.EUR;
            const gbpRate = data.rates.GBP;

            document.getElementById('currencyRates').innerHTML = `
                <p><strong>USD:</strong> ${usdRate} PLN</p>
                <p><strong>EUR:</strong> ${eurRate} PLN</p>
                <p><strong>GBP:</strong> ${gbpRate} PLN</p>
            `;
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
});

// Funkcja do wyświetlania zapisanych danych z formularza
const displaySavedData = (name, email, phone, currency, date) => {
    const savedDataContainer = document.getElementById('dataList');
    const savedDataItem = document.createElement('li');
    savedDataItem.innerHTML = `
        <strong>Imię:</strong> ${name} <br>
        <strong>E-mail:</strong> ${email} <br>
        <strong>Numer telefonu:</strong> ${phone} <br>
        <strong>Waluta:</strong> ${currency} <br>
        <strong>Data:</strong> ${date}
    `;
    savedDataContainer.appendChild(savedDataItem);
};

// Funkcja do obsługi formularza 1
document.getElementById('form1').addEventListener('submit', function(event) {
    event.preventDefault();

    // Pobranie danych z formularza
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const currency = document.getElementById('currency').value;
    const date = document.getElementById('date').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;

    // Walidacja formularza
    if (name && email && phone && currency && date && password && terms) {
        // Wyświetlenie danych w formularzu 2
        displaySavedData(name, email, phone, currency, date);

        alert('Dane zostały zapisane!');
    } else {
        alert('Wszystkie pola muszą być wypełnione!');
    }
});

// Funkcja do pobierania kursów walut na podstawie daty
document.getElementById('historicalRateForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const date = document.getElementById('historicalDate').value;
    const currency = document.getElementById('currencySelect').value;
    const url = `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/${date}/?format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[0].mid;
            document.getElementById('historicalRate').innerHTML = `
                <p><strong>Kurs ${currency} na dzień ${date}:</strong> ${rate} PLN</p>
            `;
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
});

// Funkcja do porównania kursów walut w danym okresie
document.getElementById('compareRatesForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const currencies = ['USD', 'EUR', 'GBP'];
    const promises = currencies.map(currency => {
        const url = `https://api.nbp.pl/api/exchangerates/rates/A/${currency}/${startDate}/${endDate}/?format=json`;
        return fetch(url).then(response => response.json());
    });

    Promise.all(promises)
        .then(responses => {
            const comparisonResults = responses.map((response, index) => {
                const currency = currencies[index];
                const rates = response.rates.map(rate => rate.mid).join(', ');
                return `<p><strong>${currency}:</strong> ${rates}</p>`;
            }).join('');

            document.getElementById('comparisonRates').innerHTML = comparisonResults;
        })
        .catch(error => {
            console.error('Błąd:', error);
        });
});

