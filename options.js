const listElement = document.getElementById("blocked-list");

chrome.storage.local.get("blockedSites", (data) => {
    const sites = data.blockedSites || [];
    sites.forEach((site) => {
        const li = document.createElement("li");
        li.textContent = site;
        listElement.appendChild(li);
    });
});
