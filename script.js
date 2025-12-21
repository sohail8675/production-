// ===== ROLE SWITCH =====
function showSection(role) {
  document.getElementById("roleSelect").style.display = "none";

  document.getElementById("lineLeaderSection").style.display = "none";
  document.getElementById("managerSection").style.display = "none";

  if (role === "LineLeader") {
    document.getElementById("lineLeaderSection").style.display = "block";
  }

  if (role === "Manager") {
    document.getElementById("managerSection").style.display = "block";
    loadTable();
  }
}

// ===== SAVE DATA =====
function saveProduction() {
  const line = document.getElementById("line").value.trim();
  const model = document.getElementById("model").value.trim();
  const qty = document.getElementById("qty").value;
  const reason = document.getElementById("reason").value.trim();
  const msg = document.getElementById("msg");

  if (!line || !model || !qty) {
    msg.innerText = "Line, Model aur Quantity required hai";
    return;
  }

  const record = {
    line,
    model,
    qty: Number(qty),
    reason: reason || "-",
    time: new Date().toLocaleString()
  };

  let records = JSON.parse(localStorage.getItem("productionRecords") || "[]");
  records.push(record);
  localStorage.setItem("productionRecords", JSON.stringify(records));

  msg.innerText = "Saved Successfully";

  document.getElementById("line").value = "";
  document.getElementById("model").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("reason").value = "";
}

// ===== LOAD MANAGER TABLE =====
function loadTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let records = JSON.parse(localStorage.getItem("productionRecords") || "[]");
  let total = 0;

  records.forEach(r => {
    total += r.qty;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.line}</td>
      <td>${r.model}</td>
      <td>${r.qty}</td>
      <td>${r.reason}</td>
      <td>${r.time}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("totalQty").innerText = total;
}

// ===== FILTER =====
function filterByDate() {
  const date = document.getElementById("filterDate").value;
  const line = document.getElementById("filterLine").value;

  let records = JSON.parse(localStorage.getItem("productionRecords") || "[]");

  if (date) {
    records = records.filter(r =>
      r.time.startsWith(new Date(date).toLocaleDateString())
    );
  }

  if (line) {
    records = records.filter(r => r.line === line);
  }

  updateTable(records);
}

function clearFilter() {
  document.getElementById("filterDate").value = "";
  document.getElementById("filterLine").value = "";
  loadTable();
}

function updateTable(records) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let total = 0;

  records.forEach(r => {
    total += r.qty;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.line}</td>
      <td>${r.model}</td>
      <td>${r.qty}</td>
      <td>${r.reason}</td>
      <td>${r.time}</td>
    `;
    tableBody.appendChild(tr);
  });

  document.getElementById("totalQty").innerText = total;
}
