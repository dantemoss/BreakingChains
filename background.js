let blockedSites = [];
let blockEndTime = null;

// Cargar sitios bloqueados y tiempo al iniciar
chrome.storage.local.get(["blockedSites", "blockEndTime"], (data) => {
  blockedSites = data.blockedSites || [];
  blockEndTime = data.blockEndTime || null;
  updateBlockingRules();
});

// Actualizar reglas de bloqueo dinámicamente
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
    updateBlockingRules();
  }
  if (changes.blockEndTime) {
    blockEndTime = changes.blockEndTime.newValue;
  }
});

// Crear o actualizar reglas de bloqueo
function updateBlockingRules() {
  if (blockEndTime && Date.now() < blockEndTime) {
    const rules = blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: site, resourceTypes: ["main_frame"] }
    }));

    chrome.declarativeNetRequest.updateDynamicRules(
      { removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1), addRules: rules },
      () => {
        console.log("Rules updated:", rules);
      }
    );
  } else {
    // Si el tiempo ha expirado, elimina las reglas
    chrome.declarativeNetRequest.updateDynamicRules(
      { removeRuleIds: Array.from({ length: 100 }, (_, i) => i + 1) },
      () => {
        console.log("All rules cleared.");
      }
    );
  }
}
