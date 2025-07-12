function initForm() {
    const form = document.querySelector('#contact-form');
    const languageSwitcher = document.getElementById('language-switcher');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const title = document.getElementById('title').value;
        const message = document.getElementById('message').value;

        emailjs.send('service_4ybb8cn', 'template_oiy173m', {
            name: name,
            email: email,
            title: title,
            message: message
        })
        .then(() => {
            const lang = languageSwitcher.value || 'ar';
            alert(translations[lang]?.success_message || 'Message sent successfully!');
            form.reset();
        })
        .catch(error => {
            const lang = languageSwitcher.value || 'ar';
            alert(translations[lang]?.error_message || 'Error sending message: ' + error.text);
        });
    });
}