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

const bottle = {
  svg: document.getElementById("bottleViz"),
  waterPath: document.getElementById("waterPath"),
  // These should match your bottle’s internal “fillable” vertical range (in viewBox coords)
  yTop: 105,
  yBottom: 360,
};

let wave = {
  phase: 0,
  amplitude: 6,      // wave height
  wavelength: 55,    // wave length in px
  speed: 1.3,        // phase speed
};

// Call this whenever totals update:
function setBottleLevel(totalKm, goalKm = 500) {
  const pct = clamp01(totalKm / goalKm);
  const fillHeight = (bottle.yBottom - bottle.yTop) * pct;
  bottle.baselineY = bottle.yBottom - fillHeight; // rising water means baseline moves up
}

// Generates a filled shape: sine wave on top, then down to bottom, back to start, close.
// It spans extra width so the wave can “move” without revealing edges.
function buildWaterPath({ width = 260, left = -20 } = {}) {
  const baseline = bottle.baselineY ?? bottle.yBottom;
  const bottom = bottle.yBottom;

  const step = 6; // point spacing; smaller = smoother wave
  const right = left + width;

  let d = `M ${left} ${bottom} L ${left} ${baseline} `;

  for (let x = left; x <= right; x += step) {
    const y = baseline + wave.amplitude * Math.sin((2 * Math.PI * x) / wave.wavelength + wave.phase);
    d += `L ${x} ${y} `;
  }

  d += `L ${right} ${bottom} Z`;
  return d;
}

let last = performance.now();
function animateBottle(t) {
  const dt = (t - last) / 1000;
  last = t;

  wave.phase += wave.speed * dt;

  bottle.waterPath.setAttribute("d", buildWaterPath());
  requestAnimationFrame(animateBottle);
}

// Helpers
function clamp01(x) { return Math.max(0, Math.min(1, x)); }
//////////////////////////////////////////////////////////
main();
setInterval(main, 120000);
// Example usage:
setBottleLevel(137.5, 500); // set initial level
requestAnimationFrame(animateBottle);
