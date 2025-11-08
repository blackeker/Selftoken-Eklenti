(async () => {
    try {
        const data = await chrome.storage.local.get('loginToken');
        const token = data.loginToken;

        if (token) {
            console.log('Token found, attempting login...');
            function login(t) {
                setInterval(() => {
                    document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${t}"`
                }, 50);
                setTimeout(() => {
                    location.reload();
                }, 2500);
            }
            login(token);

            // Clean up the token from storage after using it
            chrome.storage.local.remove('loginToken');
        } else {
            console.error('Login token not found in chrome.storage.local.');
        }
    } catch (e) {
        console.error('Error during login script execution:', e.message);
    }
})();