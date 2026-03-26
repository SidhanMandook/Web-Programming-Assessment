const books = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "tech",
    desc: "Guide to writing clean code.",
    img: "images/cleancode.jpg"
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "fiction",
    desc: "A dystopian novel about surveillance.",
    img: "images/1984.jpg"
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "tech",
    desc: "Best practices for programmers.",
    img: "images/pragmatic.jpg"
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "fiction",
    desc: "Build good habits and break bad ones.",
    img: "images/atomic.jpg"
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "fiction",
    desc: "Financial education and mindset.",
    img: "images/richdad.jpg"
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "fiction",
    desc: "A journey of self-discovery.",
    img: "images/alchemist.jpg"
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    genre: "tech",
    desc: "Focus without distraction.",
    img: "images/deepwork.jpg"
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    genre: "fiction",
    desc: "Success principles and mindset.",
    img: "images/thinkgrow.jpg"
  },
  {
    title: "Zero to One",
    author: "Peter Thiel",
    genre: "tech",
    desc: "Startup and innovation insights.",
    img: "images/zerotoone.jpg"
  },
  {
    title: "Ikigai",
    author: "Héctor García",
    genre: "fiction",
    desc: "Japanese philosophy of purpose.",
    img: "images/ikigai.jpg"
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "fiction",
    desc: "A fantasy adventure story.",
    img: "images/hobbit.jpg"
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "tech",
    desc: "History of humankind.",
    img: "images/sapiens.jpg"
  }
];

const container = document.getElementById("bookContainer");
const search = document.getElementById("search");
const filter = document.getElementById("filter");

let currentView = "all";

/* DISPLAY */
function displayBooks(list) {
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='padding:20px;'>No books found.</p>";
    return;
  }

  list.forEach(book => {
    const div = document.createElement("div");
    div.className = "book";

    div.innerHTML = `
      <img src="${book.img}">
      <div class="book-content">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
      </div>
    `;

    div.onclick = () => showDetails(book);
    container.appendChild(div);
  });
}

/* FAVORITES */
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

/* MODAL */
function showDetails(book) {
  document.getElementById("modalTitle").innerText = book.title;
  document.getElementById("modalAuthor").innerText = book.author;
  document.getElementById("modalDesc").innerText = book.desc;
  document.getElementById("modalImg").src = book.img;

  document.getElementById("modal").classList.remove("hidden");

  const favBtn = document.getElementById("favBtn");
  let favs = getFavorites();

  const isFav = favs.find(b => b.title === book.title);

  if (isFav) {
    favBtn.innerText = "❌ Remove from Favorites";
  } else {
    favBtn.innerText = "❤️ Add to Favorites";
  }

  favBtn.onclick = () => {
    let favs = getFavorites();

    if (favs.find(b => b.title === book.title)) {
      // REMOVE
      favs = favs.filter(b => b.title !== book.title);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("Removed from favorites!");
      favBtn.innerText = "❤️ Add to Favorites";

      // refresh favorites view if open
      if (currentView === "favorites") {
        displayBooks(favs);
      }

    } else {
      // ADD
      favs.push(book);
      localStorage.setItem("favorites", JSON.stringify(favs));
      alert("Added to favorites!");
      favBtn.innerText = "❌ Remove from Favorites";
    }
  };
}
/* CLOSE MODAL */
document.getElementById("close").onclick = () => {
  document.getElementById("modal").classList.add("hidden");
};

/* SEARCH */
search.oninput = () => {
  let list = currentView === "all" ? books : getFavorites();
  const value = search.value.toLowerCase();
  displayBooks(list.filter(b => b.title.toLowerCase().includes(value)));
};

/* FILTER */
filter.onchange = () => {
  let list = currentView === "all" ? books : getFavorites();
  const value = filter.value;
  displayBooks(value === "all" ? list : list.filter(b => b.genre === value));
};

/* VIEW SWITCH */
document.getElementById("showAll").onclick = () => {
  currentView = "all";
  displayBooks(books);
};

document.getElementById("showFav").onclick = () => {
  currentView = "favorites";
  displayBooks(getFavorites());
};

/* DARK MODE */
document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

/* INIT */
displayBooks(books);