const API = "http://localhost:5000/api/files";

// upload
async function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  const status = document.getElementById("status");

  if (!file) {
    status.innerText = "Select file first";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  status.innerText = data.message;

  loadFiles();
}

// load
async function loadFiles() {
  const res = await fetch(API);
  const files = await res.json();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(f => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${f.filename}
      <div class="actions">
        <button class="delete" onclick="deleteFile('${f.filename}')">❌</button>
      </div>
    `;

    list.appendChild(li);
  });
}
// delete
async function deleteFile(filename) {
  await fetch(`${API}/${encodeURIComponent(filename)}`, {
    method: "DELETE"
  });

  loadFiles();
}

loadFiles();