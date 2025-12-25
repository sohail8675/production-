document.addEventListener("DOMContentLoaded", () => {
  hideAll();
  document.getElementById("loginSection").style.display = "block";
});

function hideAll() {
  ["loginSection","roleSelect","lineLeaderSection","managerSection"]
    .forEach(id => document.getElementById(id).style.display = "none");
}

/* LOGIN */
function login() {
  const pin = document.getElementById("pin").value;
  if (pin !== "1234") {
    document.getElementById("loginMsg").innerText = "Wrong PIN";
    return;
  }
  hideAll();
  document.getElementById("roleSelect").style.display = "block";
}

/* ROLE */
function showSection(role) {
  hideAll();
  if (role === "LineLeader") {
    document.getElementById("lineLeaderSection").style.display = "block";
  } else {
    document.getElementById("managerSection").style.display = "block";
    loadTable();
  }
}

function goBack() {
  hideAll();
  document.getElementById("roleSelect").style.display = "block";
}

/* SAVE */
function saveProduction() {
  const line = v("line");
  const model = v("model");
  const planned = Number(v("plannedQty"));
  const actual = Number(v("actualQty"));
  const reason = v("reason");
  const leader = v("leader");
  const pqc = v("pqc");

  if (!line || !model || !planned || !actual || !leader || !pqc) {
    m("All fields required");
    return;
  }

  if (actual < planned && !reason) {
    m("Reason mandatory for low production");
    return;
  }

  const records = JSON.parse(localStorage.getItem("records") || "[]");
  records.push({
    line, model, planned, actual,
    reason: reason || "-",
    leader, pqc,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("records", JSON.stringify(records));

  m("Saved Successfully");
  ["line","model","plannedQty","actualQty","reason","leader","pqc"]
    .forEach(id => document.getElementById(id).value = "");
}

function v(id){ return document.getElementById(id).value.trim(); }
function m(t){ document.getElementById("msg").innerText = t; }

/* TABLE */
function loadTable(list) {
  const data = list || JSON.parse(localStorage.getItem("records") || "[]");
  const body = document.getElementById("tableBody");
  body.innerHTML = "";
  let total = 0;

  data.forEach(r => {
    total += r.actual;
    body.innerHTML += `
      <tr>
        <td>${r.line}</td>
        <td>${r.model}</td>
        <td>${r.planned}</td>
        <td>${r.actual}</td>
        <td>${r.reason}</td>
        <td>${r.leader}</td>
        <td>${r.pqc}</td>
        <td>${r.time}</td>
      </tr>`;
  });
  document.getElementById("totalQty").innerText = total;
}

/* FILTER */
function filterData() {
  const d = filterDate.value;
  const l = filterLine.value;
  let data = JSON.parse(localStorage.getItem("records") || "[]");

  if (d) data = data.filter(r => r.time.startsWith(new Date(d).toLocaleDateString()));
  if (l) data = data.filter(r => r.line === l);
  loadTable(data);
}

/* EXPORT */
function exportCSV() {
  let csv = "Line,Model,Planned,Actual,Reason,Leader,PQC,Time\n";
  JSON.parse(localStorage.getItem("records") || "[]")
    .forEach(r => {
      csv += `${r.line},${r.model},${r.planned},${r.actual},${r.reason},${r.leader},${r.pqc},${r.time}\n`;
    });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = "production.csv";
  a.click();
}

/* RESET */
function resetData() {
  if (confirm("Delete all data?")) {
    localStorage.removeItem("records");
    loadTable([]);
  }
}
