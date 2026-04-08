const books = [
  { title: "Clean Code", author: "Robert C. Martin", genre: "tech", desc: "Guide to writing clean code.", img: "images/cleancode.jpg", rating: "4.8", review: "Changed the way I look at software architecture forever. A must-read." },
  { title: "1984", author: "George Orwell", genre: "fiction", desc: "A dystopian novel about surveillance.", img: "images/1984.jpg", rating: "4.9", review: "Terrifyingly prophetic and beautifully written. It stays with you." },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "tech", desc: "Best practices for programmers.", img: "images/pragmatic.jpg", rating: "4.7", review: "Practical, no-nonsense advice for becoming a professional developer." },
  { title: "Atomic Habits", author: "James Clear", genre: "fiction", desc: "Build good habits and break bad ones.", img: "images/atomic.jpg", rating: "4.9", review: "Actionable steps to actually change your daily routine." },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "fiction", desc: "Financial education and mindset.", img: "images/richdad.jpg", rating: "4.5", review: "Great introduction to personal finance and thinking about assets." },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "fiction", desc: "A journey of self-discovery.", img: "images/alchemist.jpg", rating: "4.6", review: "A beautiful, poetic fable about following your dreams." },
  { title: "Deep Work", author: "Cal Newport", genre: "tech", desc: "Focus without distraction.", img: "images/deepwork.jpg", rating: "4.8", review: "Essential reading for surviving in a notification-heavy world." },
  { title: "Think and Grow Rich", author: "Napoleon Hill", genre: "fiction", desc: "Success principles and mindset.", img: "images/thinkgrow.jpg", rating: "4.4", review: "Classic mindset book. Some parts are dated, but the core holds up." },
  { title: "Zero to One", author: "Peter Thiel", genre: "tech", desc: "Startup and innovation insights.", img: "images/zerotoone.jpg", rating: "4.5", review: "Brilliant insights on creating monopolies and true innovation." },
  { title: "Ikigai", author: "Héctor García", genre: "fiction", desc: "Japanese philosophy of purpose.", img: "images/ikigai.jpg", rating: "4.6", review: "A calming read that helps you focus on what really matters." },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fiction", desc: "A fantasy adventure story.", img: "images/hobbit.jpg", rating: "4.9", review: "The perfect adventure. Cozy, thrilling, and a masterclass in world-building." },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "tech", desc: "History of humankind.", img: "images/sapiens.jpg", rating: "4.8", review: "Mind-expanding. Makes you view the entire human race differently." },
  { title: "Dune", author: "Frank Herbert", genre: "fiction", desc: "A sci-fi epic on the desert planet Arrakis.", img: "images/dune.jpg", rating: "4.8", review: "The benchmark for all science fiction. Incredible politics and ecology." },
  { title: "Cosmos", author: "Carl Sagan", genre: "tech", desc: "The story of cosmic evolution and science.", img: "images/cosmos.jpg", rating: "4.9", review: "Sagan's passion for the universe bleeds through every page." },
  { title: "The Martian", author: "Andy Weir", genre: "fiction", desc: "Survival science on the red planet.", img: "images/martian.jpg", rating: "4.7", review: "Hilarious, tense, and deeply scientifically accurate." },
  { title: "Steve Jobs", author: "Walter Isaacson", genre: "tech", desc: "The biography of the tech visionary.", img: "images/stevejobs.jpg", rating: "4.6", review: "A fascinating, unvarnished look at a very complex genius." },
  { title: "Neuromancer", author: "William Gibson", genre: "fiction", desc: "A cyberpunk classic of hackers and AI.", img: "images/neuromancer.jpg", rating: "4.5", review: "Invented the cyberpunk genre. Dense, cool, and highly influential." },
  { title: "The Phoenix Project", author: "Gene Kim", genre: "tech", desc: "A novel about IT, DevOps, and helping your business win.", img: "images/phoenix.jpg", rating: "4.7", review: "If you work in IT or management, this is a terrifyingly accurate must-read." },
  { title: "Project Hail Mary", author: "Andy Weir", genre: "fiction", desc: "A lone astronaut must save the earth from disaster.", img: "images/hailmary.jpg", rating: "4.8", review: "A perfect blend of hard science and incredible friendship." },
  { title: "Hooked", author: "Nir Eyal", genre: "tech", desc: "How to build habit-forming products.", img: "images/hooked.jpg", rating: "4.6", review: "Crucial for UX designers and product managers." }
];

/* DOM ELEMENTS */
const container = document.getElementById("bookContainer");
const dashboardPage = document.getElementById("dashboardPage");
const reviewsPage = document.getElementById("reviewsPage");
const focusPage = document.getElementById("focusPage");
const reviewsContainer = document.getElementById("reviewsContainer");

const search = document.getElementById("search");
const filter = document.getElementById("filter");

const showAllBtn = document.getElementById("showAll");
const showFavBtn = document.getElementById("showFav");
const showDashBtn = document.getElementById("showDashboard");
const showReviewsBtn = document.getElementById("showReviews");
const showFocusBtn = document.getElementById("showFocus");

let currentView = "all";

/* DASHBOARD ENGINE & CHART LOGIC */
function updateDashboard() {
  document.getElementById("totalBooksStat").innerText = books.length;

  let totalRating = books.reduce((sum, book) => sum + parseFloat(book.rating), 0);
  let avgRating = (totalRating / books.length).toFixed(1);
  document.getElementById("avgRatingStat").innerText = `${avgRating} ★`;

  let techCount = books.filter(b => b.genre === "tech").length;
  let ficCount = books.filter(b => b.genre === "fiction").length;
  let maxCount = Math.max(techCount, ficCount);

  // Small delay ensures the CSS animation fires properly
  setTimeout(() => {
    document.getElementById("techBar").style.height = `${(techCount / maxCount) * 100}%`;
    document.getElementById("ficBar").style.height = `${(ficCount / maxCount) * 100}%`;
  }, 100);

  document.getElementById("techCount").innerText = techCount;
  document.getElementById("ficCount").innerText = ficCount;
}

/* LOGIN LOGIC */
const loginPage = document.getElementById("loginPage");
const mainApp = document.getElementById("mainApp");
const loginForm = document.getElementById("loginForm");
const signOutBtn = document.getElementById("signOutBtn");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("loginError");

loginForm.onsubmit = (e) => {
  e.preventDefault(); 
  if (passwordInput.value === "sidhan") {
    loginError.classList.add("hidden");
    loginPage.classList.add("hidden");
    mainApp.classList.remove("hidden");
    switchView("dashboard");
  } else {
    loginError.classList.remove("hidden");
  }
};

signOutBtn.onclick = () => {
  mainApp.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.reset();
};

/* VIEW NAVIGATION */
function switchView(viewName) {
  // Hide all sections
  container.classList.add("hidden");
  dashboardPage.classList.add("hidden");
  reviewsPage.classList.add("hidden");
  focusPage.classList.add("hidden");
  
  // Reset active state on nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  // Hide search globally unless on library views
  search.style.display = 'none';
  filter.style.display = 'none';

  // Show requested view
  if (viewName === "dashboard") {
    dashboardPage.classList.remove("hidden");
    showDashBtn.classList.add("active");
    updateDashboard(); // Render chart data
  } else if (viewName === "reviews") {
    reviewsPage.classList.remove("hidden");
    showReviewsBtn.classList.add("active");
    renderReviews();
  } else if (viewName === "focus") {
    focusPage.classList.remove("hidden");
    showFocusBtn.classList.add("active");
  } else {
    // Library Views
    container.classList.remove("hidden");
    search.style.display = 'block';
    filter.style.display = 'block';
    
    if (viewName === "all") {
      showAllBtn.classList.add("active");
      currentView = "all";
      displayBooks(books);
    } else if (viewName === "favorites") {
      showFavBtn.classList.add("active");
      currentView = "favorites";
      displayBooks(getFavorites());
    }
  }
}

showDashBtn.onclick = () => switchView("dashboard");
showAllBtn.onclick = () => switchView("all");
showFavBtn.onclick = () => switchView("favorites");
showReviewsBtn.onclick = () => switchView("reviews");
showFocusBtn.onclick = () => switchView("focus");

/* DISPLAY BOOKS */
function displayBooks(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>No books found.</p>";
    return;
  }
  list.forEach(book => {
    const div = document.createElement("div");
    div.className = "book";
    div.innerHTML = `
      <img src="${book.img}" alt="${book.title} Cover">
      <div class="book-content">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
      </div>
    `;
    div.onclick = () => showDetails(book);
    container.appendChild(div);
  });
}

/* DISPLAY REVIEWS */
function renderReviews() {
  reviewsContainer.innerHTML = "";
  books.forEach(book => {
    const fullStars = Math.floor(parseFloat(book.rating));
    const emptyStars = 5 - fullStars;
    const starStr = '★'.repeat(fullStars) + '☆'.repeat(emptyStars);

    const div = document.createElement("div");
    div.className = "review-card";
    div.innerHTML = `
      <div class="review-header">
        <img src="${book.img}" class="review-cover">
        <div class="review-meta">
          <h3>${book.title}</h3>
          <p class="rating">${starStr} ${book.rating}</p>
        </div>
      </div>
      <p class="review-text">"${book.review}"</p>
    `;
    reviewsContainer.appendChild(div);
  });
}

function getFavorites() { return JSON.parse(localStorage.getItem("favorites")) || []; }

/* AMBIENT COLOR EXTRACTOR */
function getAverageColor(imgElement) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = canvas.width = imgElement.naturalWidth || 100;
  const height = canvas.height = imgElement.naturalHeight || 100;
  try {
    context.drawImage(imgElement, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 64) {
      r += data[i]; g += data[i+1]; b += data[i+2]; count++;
    }
    return `rgba(${Math.floor(r/count)}, ${Math.floor(g/count)}, ${Math.floor(b/count)}, 0.6)`;
  } catch (e) {
    return document.body.classList.contains('dark') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';
  }
}

/* BOOK MODAL */
function showDetails(book) {
  document.getElementById("modalTitle").innerText = book.title;
  document.getElementById("modalAuthor").innerText = book.author;
  document.getElementById("modalDesc").innerText = book.desc;
  
  const modalImg = document.getElementById("modalImg");
  modalImg.src = book.img;
  
  // Set the extracted color globally for the Focus Room
  modalImg.onload = () => {
    document.documentElement.style.setProperty('--ambient-color', getAverageColor(modalImg));
  };

  document.getElementById("modal").classList.remove("hidden");

  const favBtn = document.getElementById("favBtn");
  let favs = getFavorites();
  const isFav = favs.find(b => b.title === book.title);

  favBtn.innerText = isFav ? "Remove Favorited" : "Add to Favorites";

  favBtn.onclick = () => {
    let favs = getFavorites();
    if (favs.find(b => b.title === book.title)) {
      favs = favs.filter(b => b.title !== book.title);
      localStorage.setItem("favorites", JSON.stringify(favs));
      favBtn.innerText = "Add to Favorites";
      if (currentView === "favorites") displayBooks(favs);
    } else {
      favs.push(book);
      localStorage.setItem("favorites", JSON.stringify(favs));
      favBtn.innerText = "Remove Favorited";
    }
  };
}

document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

/* SEARCH & FILTER */
search.oninput = () => {
  let list = currentView === "all" ? books : getFavorites();
  const value = search.value.toLowerCase();
  displayBooks(list.filter(b => b.title.toLowerCase().includes(value)));
};

filter.onchange = () => {
  let list = currentView === "all" ? books : getFavorites();
  const value = filter.value;
  displayBooks(value === "all" ? list : list.filter(b => b.genre === value));
};

/* THEME TOGGLE */
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
  document.getElementById("toggleTheme").innerText = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
};

/* --- POMODORO TIMER LOGIC --- */
let timerInterval;
let isWorkMode = true;
let timeLeft = 25 * 60; // 25 mins in seconds
const timerDisplay = document.getElementById("timerDisplay");
const modeWorkBtn = document.getElementById("modeWork");
const modeBreakBtn = document.getElementById("modeBreak");

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  timerDisplay.innerText = `${m}:${s}`;
}

function setMode(workMode) {
  clearInterval(timerInterval);
  isWorkMode = workMode;
  timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
  updateTimerDisplay();
  
  if(workMode) {
    modeWorkBtn.classList.add("active");
    modeBreakBtn.classList.remove("active");
  } else {
    modeBreakBtn.classList.add("active");
    modeWorkBtn.classList.remove("active");
  }
}

modeWorkBtn.onclick = () => setMode(true);
modeBreakBtn.onclick = () => setMode(false);

document.getElementById("startTimer").onclick = () => {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      alert(isWorkMode ? "Focus session complete! Take a break." : "Break over! Time to focus.");
    }
  }, 1000);
};

document.getElementById("pauseTimer").onclick = () => clearInterval(timerInterval);
document.getElementById("resetTimer").onclick = () => setMode(isWorkMode);

/* SOUND TOGGLES (Visual Only) */
document.querySelectorAll('.sound-btn').forEach(btn => {
  btn.onclick = () => btn.classList.toggle("active");
});