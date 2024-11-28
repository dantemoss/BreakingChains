document.getElementById("add-site").addEventListener("click", () => {
    const site = document.getElementById("site-input").value.trim();
    if (!site) return alert("Enter a valid site");

    chrome.storage.local.get("blockedSites", (data) => {
        const sites = data.blockedSites || [];
        if (!sites.includes(site)) {
            sites.push(site);
            chrome.storage.local.set({ blockedSites: sites }, () => {
                alert(`${site} added to blocked sites.`);
                document.getElementById("site-input").value = "";
            });
        } else {
            alert("Site already blocked.");
        }
    });
});

document.getElementById("set-timer").addEventListener("click", () => {
    const hours = parseInt(document.getElementById("block-time").value);
    if (!hours || hours <= 0) return alert("Enter a valid number of hours");

    const blockEndTime = Date.now() + hours * 3600 * 1000;
    chrome.storage.local.set({ blockEndTime }, () => {
        alert(`Blocking active for ${hours} hours.`);
    });
});
