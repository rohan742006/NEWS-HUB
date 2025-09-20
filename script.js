let currentPage = 1; // Track current page
const pageSize = 10; // Articles per page

function loadNews(page = 1) {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "Loading news…";

    const apiKey = "e27725f896464ba8a38d64265c2c8e65"; 
    const url = `https://newsapi.org/v2/everything?q=good%20news&language=en&sortBy=publishedAt&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            container.innerHTML = "";

            if (!data.articles || data.articles.length === 0) {
                container.innerHTML = "No more news available!";
                return;
            }

            data.articles.forEach(article => {
                const div = document.createElement("div");
                div.classList.add("news-item");

                const description = article.description
                    ? article.description.substring(0, 150) + "..."
                    : "";

                div.innerHTML = `
                    ${article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" style="width:100%; border-radius:8px; margin-bottom:10px;"/>` : ""}
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
            const pagination = document.createElement("div");
            pagination.style.marginTop = "20px";

            const prevButton = document.createElement("button");
            prevButton.innerText = "Previous";
            prevButton.disabled = page === 1;
            prevButton.style.marginRight = "10px";
            prevButton.addEventListener("click", () => {
                currentPage--;
                loadNews(currentPage);
            });

            const nextButton = document.createElement("button");
            nextButton.innerText = "Next";
            nextButton.addEventListener("click", () => {
                currentPage++;
                loadNews(currentPage);
            });

            pagination.appendChild(prevButton);
            pagination.appendChild(nextButton);
            container.appendChild(pagination);

            // Last updated
            const lastUpdated = document.createElement("p");
            lastUpdated.style.fontSize = "12px";
            lastUpdated.style.marginTop = "10px";
            lastUpdated.innerText = `Last updated: ${new Date().toLocaleTimeString()}`;
            container.appendChild(lastUpdated);
        })
        .catch(err => {
            console.error(err);
            container.innerText = "Error loading news!";
        });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    loadNews(currentPage);

    // Change button text
    const refreshButton = document.getElementById("getNews");
    refreshButton.innerText = "Go to Next Page";
    refreshButton.addEventListener("click", () => {
        currentPage++;
        loadNews(currentPage);
    });
});
