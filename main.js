let box = document.querySelector(".upload_box"),
  inputfile = document.querySelector(".inputfile"),
  counter = document.querySelector(".fileCounter"),
  btn = document.querySelector(".submit_btn"),
  showFileBox = document.querySelector(".uploaded_files"),
  overlay = document.querySelector(".overlay"),
  previewModal = document.querySelector(".preview"),
  previewImg = document.querySelector("#preview-img");

let droppedFiles = 0;
let unsupportedFileDropped = false;

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  box.addEventListener(eventName, noDefaults);
  window.addEventListener(eventName, noDefaults);
});

function noDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  window.addEventListener(eventName, (e) => {
    e.dataTransfer.dropEffect = "none";
    document.body.style.background = "#ccc";
    box.classList.add("gotFocus");
  });

  box.addEventListener(eventName, () => {
    document.body.style.background = "#ccc";
    box.classList.add("highlight");
  });
});

["dragleave"].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    document.body.style.background = "#fff";
    box.classList.remove("gotFocus");
  });
  box.addEventListener(eventName, () => {
    document.body.style.background = "#fff";
    box.classList.remove("highlight");
  });
});

["drop"].forEach((eventName) => {
  window.addEventListener(eventName, () => {
    document.body.style.background = "#fff";
    box.classList.remove("gotFocus");
  });
  box.addEventListener(eventName, () => {
    document.body.style.background = "#fff";
    box.classList.remove("highlight");
  });
});

inputfile.addEventListener("change", handleFiles, false);

box.addEventListener("drop", (e) => {
  console.log(e.dataTransfer.files);
  addFiles(e);
  if (!unsupportedFileDropped) {
    fileLength = e.dataTransfer.files.length;
    droppedFiles += fileLength;
    let text = droppedFiles > 1 ? "files" : "file";
    counter.innerText = droppedFiles + " " + text + " uploaded";
    box.classList.add("uploaded");
    showFileBox.classList.remove("hidden");
    counter.classList.remove("hidden");
    btn.classList.remove("hidden");
  }
});

function addFiles(e) {
  let nonImgSpotted = false;
  [...e.dataTransfer.files].forEach((file, i) => {
    if (file.type.includes("image")) {
      unsupportedFileDropped = false;
      let li = document.createElement("li");
      showFileBox.appendChild(li);

      let img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.setAttribute("draggable", "false");
      let imgclone = img.cloneNode(true);
      imgclone.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
      img.onclick = () => {
        URL.revokeObjectURL(imgclone.src);
        imgclone.setAttribute("id", "preview-img");
        imgclone.setAttribute("draggable", "false");
        imgclone.addEventListener("click", (e) => {
          e.cancelBubble = true;
        });
        previewModal.appendChild(imgclone);
        overlay.classList.remove("hidden");
      };
      li.appendChild(img);
      let name = document.createElement("p");
      name.innerText = `${file.name}`;
      li.appendChild(name);

      let removeBtn = document.createElement("button");
      removeBtn.innerHTML = `<i class="bi bi-trash3-fill"></i>`;
      removeBtn.classList.add("remove-btn");
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        li.remove();
        updateCounter();
      });
      li.appendChild(removeBtn);
    } else nonImgSpotted = true;
  });
  if (nonImgSpotted) {
    unsupportedFileDropped = true;
    let fileLength = e.dataTransfer.files.length;
    fileLength > 1
      ? alert(
          "Selected files contain unsupported type. Please, upload only images"
        )
      : alert("It is not an image. Please, upload only images");
    return;
  }
}

function handleFiles() {
  fileLength = this.files.length;
  droppedFiles += fileLength;
  let text = droppedFiles > 1 ? "files" : "file";
  counter.innerText = droppedFiles + " " + text + " uploaded";
  box.classList.add("uploaded");
  counter.classList.remove("hidden");
  btn.classList.remove("hidden");

  for (let i = 0; i < this.files.length; i++) {
    let li = document.createElement("li");
    showFileBox.appendChild(li);

    let img = document.createElement("img");
    img.src = URL.createObjectURL(this.files[i]);
    img.setAttribute("draggable", "false");
    let imgclone = img.cloneNode(true);
    imgclone.src = URL.createObjectURL(this.files[i]);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
    };
    img.onclick = () => {
      URL.revokeObjectURL(imgclone.src);
      imgclone.setAttribute("id", "preview-img");
      imgclone.setAttribute("draggable", "false");
      imgclone.addEventListener("click", (e) => {
        e.cancelBubble = true;
      });
      previewModal.appendChild(imgclone);
      overlay.classList.remove("hidden");
    };
    li.appendChild(img);

    let name = document.createElement("p");
    name.innerText = `${this.files[i].name}`;
    li.appendChild(name);

    let removeBtn = document.createElement("button");
    removeBtn.innerHTML = `<i class="bi bi-trash3-fill"></i>`;
    removeBtn.classList.add("remove-btn");
    removeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      li.remove();
      updateCounter();
    });
    li.appendChild(removeBtn);
  }
  showFileBox.classList.remove("hidden");
}

function updateCounter() {
  droppedFiles -= 1;
  let text = droppedFiles > 1 ? "files" : "file";
  counter.innerText = droppedFiles + " " + text + " uploaded";
  if (!droppedFiles) {
    box.classList.remove("uploaded");
    showFileBox.classList.add("hidden");
    counter.classList.add("hidden");
    btn.classList.add("hidden");
  }
}

function closeModal() {
  overlay.classList.add("hidden");
}

previewModal.addEventListener("load", (e) => {
  e.stopPropagation();
});

overlay.addEventListener("click", () => {
  overlay.classList.add("hidden");
  let child = previewModal.querySelector("#preview-img");
  previewModal.removeChild(child);
});
