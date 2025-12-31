// Put your Apps Script Web App URL here:
const API_URL = "https://script.google.com/macros/s/AKfycbxUhKRZFFPMUgxXJ0NZMCbIIm-frmaL5oXxVaHzgNFRtJW-x9zkejC06F7GUqhnx8vMGw/exec";

async function main() {
  const data = await fetch(API_URL, { cache: "no-store" }).then(r => r.json());

  document.getElementById("updatedAt").textContent =
    new Date(data.updatedAt).toLocaleString();

  document.getElementById("goalKm").textContent = data.goalKm.toFixed(0);
  document.getElementById("groupTotal").textContent = data.groupTotalKm.toFixed(1);

  const bar = document.getElementById("groupBar");
  bar.max = data.goalKm;
  bar.value = data.groupTotalKm;

  const tbody = document.getElementById("leader");
  tbody.innerHTML = "";
  for (const p of data.perPerson) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${escapeHtml(p.name)}</td><td class="right">${Number(p.km).toFixed(1)}</td>`;
    tbody.appendChild(tr);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

main();
setInterval(main, 120000);
