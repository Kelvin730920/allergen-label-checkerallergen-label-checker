
let data = [];

function loadData(file) {
  fetch(file).then(res => res.json()).then(json => {
    data = json;
    render();
  });
}

function render() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const fragCount = parseInt(document.getElementById("fragranceCount").value);

  data.forEach((item, idx) => {
    const row = document.createElement("tr");
    let cells = `
      <td>${item.name}</td>
      <td>${item.cas}</td>
    `;
    for (let i = 1; i <= 3; i++) {
      cells += `
        <td class="frag${i}" style="${i <= fragCount ? '' : 'display:none'}">
          <input type="number" data-row="${idx}" data-frag="${i}" step="0.01">
        </td>
      `;
    }
    cells += `<td id="final-${idx}">--</td><td id="label-${idx}">--</td>`;
    row.innerHTML = cells;
    tbody.appendChild(row);
  });

  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", calculate);
  });
}

function calculate() {
  const productType = document.getElementById("productType").value;
  const fragrancePercent = parseFloat(document.getElementById("fragrancePercent").value) || 0;
  const fragCount = parseInt(document.getElementById("fragranceCount").value);
  const threshold = productType === "rinse" ? 0.01 : 0.001;

  data.forEach((_, idx) => {
    let total = 0;
    for (let i = 1; i <= fragCount; i++) {
      const el = document.querySelector(\`input[data-row='\${idx}'][data-frag='\${i}']\`);
      const v = parseFloat(el?.value || 0);
      total += (fragrancePercent / fragCount) * (v / 100);
    }
    document.getElementById(\`final-\${idx}\`).textContent = total.toFixed(4);
    const label = document.getElementById(\`label-\${idx}\`);
    label.textContent = total >= threshold ? "需標示 ⚠️" : "可免標示 ✅";
    label.style.color = total >= threshold ? "red" : "green";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("regulation").addEventListener("change", e => loadData(e.target.value));
  document.getElementById("productType").addEventListener("change", calculate);
  document.getElementById("fragrancePercent").addEventListener("input", calculate);
  document.getElementById("fragranceCount").addEventListener("change", () => { render(); calculate(); });
  loadData("data_eu81.json");
});
