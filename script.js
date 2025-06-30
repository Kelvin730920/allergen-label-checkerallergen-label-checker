
let data = [];

function loadData() {
  fetch("data_tw24.json").then(res => res.json()).then(json => {
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
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.cas}</td>
      <td><input type="number" data-row="${idx}" data-frag="1" step="0.01"></td>
      <td class="frag2"><input type="number" data-row="${idx}" data-frag="2" step="0.01" ${fragCount >= 2 ? '' : 'disabled'}></td>
      <td id="final-${idx}">--</td>
      <td id="label-${idx}">--</td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", calculate);
  });

  document.querySelectorAll(".frag2").forEach(cell => {
    cell.style.display = fragCount >= 2 ? "table-cell" : "none";
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
  document.getElementById("productType").addEventListener("change", calculate);
  document.getElementById("fragrancePercent").addEventListener("input", calculate);
  document.getElementById("fragranceCount").addEventListener("change", () => { render(); calculate(); });
  loadData();
});
