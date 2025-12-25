// ===== PAGE LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("roleSelect").style.display = "none";
  document.getElementById("lineLeaderSection").style.display = "none";
  document.getElementById("managerSection").style.display = "none";
});

// ===== LOGIN =====
function login() {
  const pin = document.getElementById("pin").value;
  const msg = document.getElementById("loginMsg");

  if (pin !== "1234") {
    msg.innerText = "Wrong PIN";
    return;
  }

  msg.innerText = "";
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("roleSelect").style.display = "block";
}

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

// ===== BACK =====
function goBack() {
  document.getElementById("lineLeaderSection").style.display = "none";
  document.getElementById("managerSection").style.display = "none";
  document.getElementById("roleSelect").style.display = "block";
}

// ===== SAVE DATA =====
function saveProduction() {
  const line = getVal("line");
  const model = getVal("model");
  const plannedQty = getVal("plannedQty");
  const actualQty = getVal("qty");
  const reason = getVal("reason");
  const leader = getVal("lineLeaderSelect");
  const pqc = getVal("pqcSelect");

  if (!line || !model || !plannedQty || !actualQty || !leader || !pqc) {
    document.getElementById("msg").innerText = "All fields required";
    return;
  }

  if (actualQty < plannedQty && !reason) {
    document.getElementById("msg").innerText = "Reason required for low production";
    return;
  }

  const record = {
    line,
    model,
    plannedQty: Number(plannedQty),
    actualQty: Number(actualQty),
    reason: reason || "-",
    leader,
    pqc,
    time: new Date().toLocaleString()
  };

  const records = JSON.parse(localStorage.getItem("records") || "[]");
  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));

  document.getElementById("msg").innerText = "Saved Successfully";

  ["line","model","plannedQty","qty","reason"].forEach(id => document.getElementById(id).value="");
  document.getElementById("lineLeaderSelect").value = "";
  document.getElementById("pqcSelect").value = "";
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

// ===== LOAD MANAGER TABLE =====
function loadTable(list) {
  const data = list || JSON.parse(localStorage.getItem("records") || "[]");
  const body = document.getElementById("tableBody");
  body.innerHTML = "";

  let total = 0;

  data.forEach(r => {
    total += r.actualQty;
    body.innerHTML += `
      <tr>
        <td>${r.line}</td>
        <td>${r.model}</td>
        <td>${r.plannedQty}</td>
        <td>${r.actualQty}</td>
        <td>${r.reason}</td>
        <td>${r.leader}</td>
        <td>${r.pqc}</td>
        <td>${r.time}</td>
      </tr>`;
  });

  document.getElementById("totalQty").innerText = total;
}

// ===== FILTER =====
function filterData() {
  const date = filterDate.value;
  const line = filterLine.value;

  let records = JSON.parse(localStorage.getItem("records") || "[]");

  if (date)
    records = records.filter(r => r.time.startsWith(new Date(date).toLocaleDateString()));
  if (line)
    records = records.filter(r => r.line === line);

  loadTable(records);
}

// ===== EXPORT =====
function exportCSV() {
  let csv = "Line,Model,Planned,Actual,Reason,Leader,PQC,Time\n";
  const records = JSON.parse(localStorage.getItem("records") || "[]");

  records.forEach(r => {
    csv += `${r.line},${r.model},${r.plannedQty},${r.actualQty},${r.reason},${r.leader},${r.pqc},${r.time}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "production.csv";
  a.click();
}

// ===== RESET =====
function resetData() {
  if (confirm("Delete all data?")) {
    localStorage.removeItem("records");
    loadTable([]);
  }
}
