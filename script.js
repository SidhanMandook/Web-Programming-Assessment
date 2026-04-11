const books = [
  { title: "Clean Code", author: "Robert C. Martin", genre: "tech", desc: "Guide to writing clean code.", img: "images/cleancode.jpg", rating: "4.8", review: "Changed the way I look at software architecture forever. A must-read." },
  { title: "1984", author: "George Orwell", genre: "fiction", desc: "A dystopian novel about surveillance.", img: "images/1984.jpg", rating: "4.9", review: "Terrifyingly prophetic and beautifully written. It stays with you." },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "tech", desc: "Best practices for programmers.", img: "images/pragmatic.jpg", rating: "4.7", review: "Practical, no-nonsense advice for becoming a professional developer." },
  { title: "Atomic Habits", author: "James Clear", genre: "fiction", desc: "Build good habits and break bad ones.", img: "images/atomic.jpg", rating: "4.9", review: "Actionable steps to actually change your daily routine." },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "history", desc: "History of humankind.", img: "images/sapiens.jpg", rating: "4.8", review: "Mind-expanding. Makes you view the entire human race differently." },
  { title: "Steve Jobs", author: "Walter Isaacson", genre: "biography", desc: "The biography of the tech visionary.", img: "images/stevejobs.jpg", rating: "4.6", review: "A fascinating, unvarnished look at a very complex genius." },
  { title: "Dune", author: "Frank Herbert", genre: "fantasy", desc: "A sci-fi epic on the desert planet Arrakis.", img: "images/dune.jpg", rating: "4.8", review: "The benchmark for all science fiction. Incredible politics and ecology." },
  { title: "Deep Work", author: "Cal Newport", genre: "tech", desc: "Focus without distraction.", img: "images/deepwork.jpg", rating: "4.8", review: "Essential reading for surviving in a notification-heavy world." },
  { title: "Think and Grow Rich", author: "Napoleon Hill", genre: "history", desc: "Success principles and mindset.", img: "images/thinkgrow.jpg", rating: "4.4", review: "Classic mindset book. Some parts are dated, but the core holds up." },
  { title: "Zero to One", author: "Peter Thiel", genre: "tech", desc: "Startup and innovation insights.", img: "images/zerotoone.jpg", rating: "4.5", review: "Brilliant insights on creating monopolies and true innovation." },
  { title: "Ikigai", author: "Héctor García", genre: "history", desc: "Japanese philosophy of purpose.", img: "images/ikigai.jpg", rating: "4.6", review: "A calming read that helps you focus on what really matters." },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fantasy", desc: "A fantasy adventure story.", img: "images/hobbit.jpg", rating: "4.9", review: "The perfect adventure. Cozy, thrilling, and a masterclass in world-building." },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "fiction", desc: "Financial education and mindset.", img: "images/richdad.jpg", rating: "4.5", review: "Great introduction to personal finance and thinking about assets." },
  { title: "Cosmos", author: "Carl Sagan", genre: "history", desc: "The story of cosmic evolution and science.", img: "images/cosmos.jpg", rating: "4.9", review: "Sagan's passion for the universe bleeds through every page." },
  { title: "The Martian", author: "Andy Weir", genre: "fiction", desc: "Survival science on the red planet.", img: "images/martian.jpg", rating: "4.7", review: "Hilarious, tense, and deeply scientifically accurate." },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "fiction", desc: "A journey of self-discovery.", img: "images/alchemist.jpg", rating: "4.6", review: "A beautiful, poetic fable about following your dreams." },
  { title: "Neuromancer", author: "William Gibson", genre: "fantasy", desc: "A cyberpunk classic of hackers and AI.", img: "images/neuromancer.jpg", rating: "4.5", review: "Invented the cyberpunk genre. Dense, cool, and highly influential." },
  { title: "The Phoenix Project", author: "Gene Kim", genre: "tech", desc: "A novel about IT, DevOps, and helping your business win.", img: "images/phoenix.jpg", rating: "4.7", review: "If you work in IT or management, this is a terrifyingly accurate must-read." },
  { title: "Project Hail Mary", author: "Andy Weir", genre: "fiction", desc: "A lone astronaut must save the earth from disaster.", img: "images/hailmary.jpg", rating: "4.8", review: "A perfect blend of hard science and incredible friendship." },
  { title: "Shoe Dog", author: "Phil Knight", genre: "biography", desc: "Creator of Nike.", img: "images/shoedog.jpg", rating: "4.9", review: "The best business biography ever written." }
];

/* DOM ELEMENTS */
const container = document.getElementById("bookContainer");
const dashboardPage = document.getElementById("dashboardPage");
const reviewsPage = document.getElementById("reviewsPage");
const focusPage = document.getElementById("focusPage");
const reviewsContainer = document.getElementById("reviewsContainer");

const heroSearch = document.getElementById("heroSearch");
const heroBanner = document.getElementById("heroBanner");
const filter = document.getElementById("filter");

const showAllBtn = document.getElementById("showAll");
const showFavBtn = document.getElementById("showFav");
const showDashBtn = document.getElementById("showDashboard");
const showReviewsBtn = document.getElementById("showReviews");
const showFocusBtn = document.getElementById("showFocus");

let currentView = "all";
let activityChartInstance = null;
let genreChartInstance = null;

/* CHECK THEME ON LOAD */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  document.getElementById("toggleTheme").innerText = "Light Mode";
}

/* DYNAMIC DASHBOARD ENGINE WITH CHART.JS */
function updateDashboard() {
  document.getElementById("totalBooksStat").innerText = books.length;
  let totalRating = books.reduce((sum, b) => sum + parseFloat(b.rating), 0);
  document.getElementById("avgRatingStat").innerText = (totalRating / books.length).toFixed(1) + " ★";

  const genreCounts = {};
  books.forEach(b => genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1);

  const isDarkMode = document.body.classList.contains("dark");
  const textColor = isDarkMode ? "#F5F5F5" : "#666666";
  const gridColor = isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";

  // --- ACTIVITY CHART (Line Chart) ---
  const activityCtx = document.getElementById('activityChart').getContext('2d');
  if(activityChartInstance) activityChartInstance.destroy();
  activityChartInstance = new Chart(activityCtx, {
      type: 'line',
      data: {
          labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
          datasets: [{
              label: 'Books Finished',
              data: [3, 5, 2, 8, 4, 6],
              borderColor: '#005596',
              backgroundColor: 'rgba(0, 85, 150, 0.1)',
              fill: true,
              tension: 0.4
          }]
      },
      options: { 
          responsive: true, 
          plugins: { legend: { display: false } },
          scales: {
              y: { ticks: { color: textColor }, grid: { color: gridColor } },
              x: { ticks: { color: textColor }, grid: { color: gridColor } }
          }
      }
  });

  // --- GENRE CHART (Doughnut Chart) ---
  const genreCtx = document.getElementById('genreChart').getContext('2d');
  if(genreChartInstance) genreChartInstance.destroy();
  genreChartInstance = new Chart(genreCtx, {
      type: 'doughnut',
      data: {
          labels: Object.keys(genreCounts),
          datasets: [{
              data: Object.values(genreCounts),
              backgroundColor: ['#005596', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e'],
              borderWidth: isDarkMode ? 0 : 2,
              borderColor: isDarkMode ? 'transparent' : '#FFFFFF'
          }]
      },
      options: { 
          responsive: true, 
          cutout: '70%',
          plugins: { 
              legend: { 
                  position: 'bottom', 
                  labels: { color: textColor, boxWidth: 10 } 
              } 
          } 
      }
  });
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
  container.classList.add("hidden");
  dashboardPage.classList.add("hidden");
  reviewsPage.classList.add("hidden");
  focusPage.classList.add("hidden");
  
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  heroBanner.classList.add('hidden');
  filter.style.display = 'none';

  if (viewName === "dashboard") {
    dashboardPage.classList.remove("hidden");
    showDashBtn.classList.add("active");
    updateDashboard(); // Important: Calls the chart generation
  } else if (viewName === "reviews") {
    reviewsPage.classList.remove("hidden");
    showReviewsBtn.classList.add("active");
    renderReviews();
  } else if (viewName === "focus") {
    focusPage.classList.remove("hidden");
    showFocusBtn.classList.add("active");
  } else {
    container.classList.remove("hidden");
    heroBanner.classList.remove("hidden"); 
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
  list.forEach((book, index) => {
    const div = document.createElement("div");
    div.className = "book";
    div.style.animationDelay = `${index * 0.05}s`;
    div.innerHTML = `
      <img src="${book.img}" alt="${book.title} Cover" onerror="this.src='https://via.placeholder.com/220x330?text=No+Cover'">
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
        <img src="${book.img}" class="review-cover" onerror="this.src='https://via.placeholder.com/60x90?text=NA'">
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
  
  modalImg.onload = () => {
    document.documentElement.style.setProperty('--ambient-color', getAverageColor(modalImg));
  };
  modalImg.onerror = () => {
    modalImg.src = 'https://via.placeholder.com/220x330?text=No+Cover';
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
heroSearch.oninput = () => {
  let list = currentView === "all" ? books : getFavorites();
  const value = heroSearch.value.toLowerCase();
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
  const isDark = document.body.classList.contains("dark");
  document.getElementById("toggleTheme").innerText = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
  
  // Update charts if currently on dashboard to reflect theme colors
  if(!dashboardPage.classList.contains("hidden")) {
    updateDashboard();
  }
};

/* POMODORO TIMER LOGIC */
let timerInterval;
let isWorkMode = true;
let timeLeft = 25 * 60; 
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