let myPort = browser.runtime.connect({ name: "port-from-cs" });

myPort.onMessage.addListener(async (m) => {
    if (m.success) {
        try {
            await navigator.clipboard.writeText(m.url);
            alert('Successfully copied short url to clipboard.\n' + m.url);
        } catch (err) {
            alert("Failed to copy...");
            console.error('Failed to copy: ', err);
        }
    } else {
        alert("There is an error in server...")
    }
})