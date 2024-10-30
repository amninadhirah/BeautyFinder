const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');


if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools. kalau dah siap commentkan 
  mainWindow.webContents.openDevTools();
};
app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('message', (event, arg) => {
  console.log(arg); 
  event.reply('reply', 'Message received'); 
});

var mainMenuTemplate = [
  {
    label:'File',
    submenu:[
      {
        label: 'Add new item',
        click(){
          addWindow = new BrowserWindow({
            width: 800,
            height: 600,
            title:"Add new item",

            webPreferences:{
              nodeIntegration: true,
              contextIsolation: false
            }
          });
          addWindow.loadFile(path.join(__dirname, 'add.html'));
        }
      },
      {label: 'Update',
        click(){
          addWindow = new BrowserWindow({
            
          })
        }
      }
    ]
  }
]
function addReview(event) {
  event.preventDefault(); 
  const name = document.getElementById("name").value;
  const reviewText = document.getElementById("review").value;
  if (!name || !reviewText) {
      alert("Please fill in both the name and review fields.");
      return;
  }
  const reviewId = new Date().getTime().toString();
  const review = { id: reviewId, name, review: reviewText };

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  
  reviews.push(review);

  localStorage.setItem("reviews", JSON.stringify(reviews));
  displayReview(review);
  document.getElementById("reviewForm").reset();
}
function displayReview(review) {
  const reviewsContainer = document.querySelector(".reviews");
  const reviewItem = document.createElement("div");
  reviewItem.classList.add("review-item");
  reviewItem.setAttribute("data-id", review.id); 
  reviewItem.innerHTML = `
      <h3>${review.name}</h3>
      <p class="review-text">"${review.review}"</p>
      <button onclick="editReview('${review.id}')">Edit</button>
  `;
  reviewsContainer.appendChild(reviewItem);
}
function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  
  reviews.forEach(displayReview);
}

function editReview(reviewId) {
  console.log("Edit button clicked for review ID:", reviewId); 

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

  if (reviewIndex !== -1) {
      const reviewItem = document.querySelector(`.review-item[data-id="${reviewId}"]`);
      if (reviewItem) {
          const currentText = reviewItem.querySelector(".review-text");
          const editButton = reviewItem.querySelector("button");
          currentText.style.display = "none";
          editButton.style.display = "none";
          const editArea = document.createElement("textarea");
          editArea.classList.add("edit-textarea");
          editArea.value = reviews[reviewIndex].review;
          reviewItem.appendChild(editArea);

          const saveButton = document.createElement("button");
          saveButton.textContent = "Save";
          saveButton.onclick = function () {
              const newReviewText = editArea.value.trim();
              if (newReviewText) {
                  reviews[reviewIndex].review = newReviewText;
                  localStorage.setItem("reviews", JSON.stringify(reviews));
                  currentText.textContent = `"${newReviewText}"`;
              }
              editArea.remove();
              saveButton.remove();
              cancelButton.remove();
              currentText.style.display = "block";
              editButton.style.display = "inline";
          };

          const cancelButton = document.createElement("button");
          cancelButton.textContent = "Cancel";
          cancelButton.onclick = function () {
              editArea.remove();
              saveButton.remove();
              cancelButton.remove();
              currentText.style.display = "block";
              editButton.style.display = "inline";
          };
          reviewItem.appendChild(saveButton);
          reviewItem.appendChild(cancelButton);
      } else {
          console.error("Review element not found on the page."); 
      }
  } else {
      alert("Review not found.");
      console.error("Review not found in localStorage."); 
  }
}
document.addEventListener("DOMContentLoaded", loadReviews);
