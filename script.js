let currentPage = 1; // start at page 1
const pageSize = 10; // articles per page
const apiKey = "4170b022847a3c5538594a469a8a9def"; // replace with your GNews API key

function loadNews(page = 1) {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "Loading news…";

    const url = `https://gnews.io/api/v4/search?q=good news&lang=en&max=${pageSize}&page=${page}&token=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = "";

            if (!data.articles || data.articles.length === 0) {
                container.innerHTML = "No news found at the moment!";
                return;
            }

            data.articles.forEach(article => {
                const div = document.createElement("div");
                div.classList.add("news-item");

                // Fallback image if article.image is missing
                const imageUrl = article.image ? article.image : "placeholder.jpg";

                const description = article.description
                    ? article.description.substring(0, 150) + "..."
                    : "";

                div.innerHTML = `
                    <img src="${imageUrl}" alt="News Image" style="width:100%; border-radius:8px; margin-bottom:10px;">
                    <h3>${article.title}</h3>
                    <p>${description}</p>
                    <a href="${article.url}" target="_blank">Read More</a>
                    <div class="share-buttons" style="margin-top:10px;">
                        <a href="https://wa.me/?text=${encodeURIComponent(article.title + ' ' + article.url)}" target="_blank">WhatsApp</a>
                        <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title + ' ' + article.url)}" target="_blank">Twitter</a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}" target="_blank">Facebook</a>
                    </div>
                    <small>Source: ${article.source.name} | Published: ${new Date(article.publishedAt).toLocaleString()}</small>
                `;

                container.appendChild(div);
            });

            // Pagination buttons
            const paginationDiv = document.createElement("div");
            paginationDiv.style.marginTop = "20px";

            if (page > 1) {
                const prevBtn = document.createElement("button");
                prevBtn.innerText = "◀️ Previous Page";
                prevBtn.style.marginRight = "10px";
                prevBtn.onclick = () => {
                    currentPage--;
                    loadNews(currentPage);
                };
                paginationDiv.appendChild(prevBtn);
            }

            const nextBtn = document.createElement("button");
            nextBtn.innerText = "Next Page ▶️";
            nextBtn.onclick = () => {
                currentPage++;
                loadNews(currentPage);
            };
            paginationDiv.appendChild(nextBtn);

            container.appendChild(paginationDiv);
        })
        .catch(err => {
            console.error(err);
            container.innerText = "Error loading news!";
        });
}

// Load news automatically on page load
window.onload = () => {
    currentPage = 1;
    loadNews(currentPage);
};

// Optional: if you want a button to reload news manually
// document.getElementById("getNews").addEventListener("click", () => {
//     currentPage = 1;
//     loadNews(currentPage);
// });
