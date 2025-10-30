const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");

// Search when button clicked
searchBtn.addEventListener("click", searchBooks);

// Search when Enter is pressed
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBooks();
});

// Main function to fetch books
async function searchBooks() {
  const query = searchInput.value.trim() || "bestseller";
  resultsDiv.innerHTML = `<p>Loading...</p>`;

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=20`
    );
    const data = await res.json();

    if (!data.items) {
      resultsDiv.innerHTML = `<p>No books found!</p>`;
      return;
    }

    displayBooks(data.items);
  } catch (err) {
    resultsDiv.innerHTML = `<p>Error fetching books. Try again later.</p>`;
    console.error(err);
  }
}

// Function to display books in grid
function displayBooks(books) {
  resultsDiv.innerHTML = "";

  books.forEach((book) => {
    const info = book.volumeInfo;
    const title = info.title || "Untitled";
    const authors = info.authors ? info.authors.join(", ") : "Unknown Author";
    const thumbnail =
      info.imageLinks?.thumbnail ||
      "https://via.placeholder.com/150x240?text=No+Cover";

    const card = document.createElement("div");
    card.classList.add("book-card");
    card.innerHTML = `
      <img src="${thumbnail}" alt="${title}" class="book-image">
      <div class="book-info">
        <h3 class="book-title">${title}</h3>
        <p class="book-author">by ${authors}</p>
        <button class="btn-primary" onclick="window.open('${
          info.previewLink || "#"
        }', '_blank')">Preview</button>
      </div>
    `;

    resultsDiv.appendChild(card);
  });
}
