const books = [
  { title: "Clean Code", author: "Robert C. Martin", genre: "tech", desc: "Guide to writing clean code.", img: "images/cleancode.jpg" },
  { title: "1984", author: "George Orwell", genre: "fiction", desc: "A dystopian novel about surveillance.", img: "images/1984.jpg" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", genre: "tech", desc: "Best practices for programmers.", img: "images/pragmatic.jpg" },
  { title: "Atomic Habits", author: "James Clear", genre: "fiction", desc: "Build good habits and break bad ones.", img: "images/atomic.jpg" },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", genre: "fiction", desc: "Financial education and mindset.", img: "images/richdad.jpg" },
  { title: "The Alchemist", author: "Paulo Coelho", genre: "fiction", desc: "A journey of self-discovery.", img: "images/alchemist.jpg" },
  { title: "Deep Work", author: "Cal Newport", genre: "tech", desc: "Focus without distraction.", img: "images/deepwork.jpg" },
  { title: "Think and Grow Rich", author: "Napoleon Hill", genre: "fiction", desc: "Success principles and mindset.", img: "images/thinkgrow.jpg" },
  { title: "Zero to One", author: "Peter Thiel", genre: "tech", desc: "Startup and innovation insights.", img: "images/zerotoone.jpg" },
  { title: "Ikigai", author: "Héctor García", genre: "fiction", desc: "Japanese philosophy of purpose.", img: "images/ikigai.jpg" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "fiction", desc: "A fantasy adventure story.", img: "images/hobbit.jpg" },
  { title: "Sapiens", author: "Yuval Noah Harari", genre: "tech", desc: "History of humankind.", img: "images/sapiens.jpg" },
  { title: "Dune", author: "Frank Herbert", genre: "fiction", desc: "A sci-fi epic on the desert planet Arrakis.", img: "images/dune.jpg" },
  { title: "Cosmos", author: "Carl Sagan", genre: "tech", desc: "The story of cosmic evolution and science.", img: "images/cosmos.jpg" },
  { title: "The Martian", author: "Andy Weir", genre: "fiction", desc: "Survival science on the red planet.", img: "images/martian.jpg" },
  { title: "Steve Jobs", author: "Walter Isaacson", genre: "tech", desc: "The biography of the tech visionary.", img: "images/stevejobs.jpg" },
  { title: "Neuromancer", author: "William Gibson", genre: "fiction", desc: "A cyberpunk classic of hackers and AI.", img: "images/neuromancer.jpg" },
  { title: "The Phoenix Project", author: "Gene Kim", genre: "tech", desc: "A novel about IT, DevOps, and helping your business win.", img: "images/phoenix.jpg" },
  { title: "Project Hail Mary", author: "Andy Weir", genre: "fiction", desc: "A lone astronaut must save the earth from disaster.", img: "images/hailmary.jpg" },
  { title: "Hooked", author: "Nir Eyal", genre: "tech", desc: "How to build habit-forming products.", img: "images/hooked.jpg" }
];

/* DOM ELEMENTS */
const container = document.getElementById("bookContainer");
const dashboardPage = document.getElementById("dashboardPage");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

const showAllBtn = document.getElementById("showAll");
const showFavBtn = document.getElementById("showFav");
const showDashBtn = document.getElementById("showDashboard");

let currentView = "all";

/* LOGIN / LOGOUT LOGIC */
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
    
    // Default to Dashboard on login
    switchView("dashboard");
  } else {
    loginError.classList.remove("hidden");
  }
};

signOutBtn.onclick = () => {
  mainApp.classList.add("hidden");
  loginPage.classList.remove("hidden");
  loginForm.reset();
  loginError.classList.add("hidden");
};

/* VIEW NAVIGATION */
function switchView(viewName) {
  // Hide all containers
  container.classList.add("hidden");
  dashboardPage.classList.add("hidden");
  
  // Remove active state from all buttons
  showAllBtn.classList.remove("active");
  showFavBtn.classList.remove("active");
  showDashBtn.classList.remove("active");

  if (viewName === "dashboard") {
    dashboardPage.classList.remove("hidden");
    showDashBtn.classList.add("active");
    // Hide search/filter on dashboard
    search.style.display = 'none';
    filter.style.display = 'none';
  } else {
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

/* DISPLAY LOGIC */
function displayBooks(list) {
  container.innerHTML = "";
  if (list.length === 0) {
    container.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);'>No books found.</p>";
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

/* FAVORITES LOGIC */
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

/* AMBIENT LIGHTING COLOR EXTRACTOR */
function getAverageColor(imgElement) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = canvas.width = imgElement.naturalWidth || imgElement.width || 100;
  const height = canvas.height = imgElement.naturalHeight || imgElement.height || 100;

  try {
    context.drawImage(imgElement, 0, 0, width, height);
    const data = context.getImageData(0, 0, width, height).data;
    let r = 0, g = 0, b = 0, count = 0;

    // Sample every 16th pixel for speed
    for (let i = 0; i < data.length; i += 64) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
      count++;
    }
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  } catch (e) {
    // Fallback if local file system blocks canvas reading
    return document.body.classList.contains('dark') ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)';
  }
}

/* BOOK DETAILS MODAL */
function showDetails(book) {
  document.getElementById("modalTitle").innerText = book.title;
  document.getElementById("modalAuthor").innerText = book.author;
  document.getElementById("modalDesc").innerText = book.desc;
  
  const modalImg = document.getElementById("modalImg");
  const modalContent = document.getElementById("modalContent");
  
  // Reset color to prevent flashing old color
  modalContent.style.setProperty('--ambient-color', 'transparent');
  
  modalImg.src = book.img;
  
  // Generate Ambient Lighting when image loads
  modalImg.onload = () => {
    const dominantColor = getAverageColor(modalImg);
    modalContent.style.setProperty('--ambient-color', dominantColor);
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

/* MODAL CLOSING */
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
const themeBtn = document.getElementById("toggleTheme");
themeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.innerText = isDark ? "Light Mode" : "Dark Mode";
};