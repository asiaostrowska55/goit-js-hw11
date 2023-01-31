import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const API_KEY = "33257268-27ad9fcecc17d6e2546f4b9dc";
const searchForm = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");

let page = 1;
let totalPages = 0;
const lightBox = new SimpleLightbox(".gallery a");
const axios = require("axios").default;

async function fetchGalleryImage(search, page) {
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: API_KEY,
        q: search,
        image_type: "photo",
        orientation: "horizonatal",
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    const data = response.data;
    if (data.totalHits > 0) {
      data.hits.forEach((photo) => {
        renderGalleryItem(photo);
      });
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    lightBox.refresh();
    const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } catch (error) {
    Notify.failure(
      "Sorry, there are no images matching your search query. Please try again."
    );
    console.log(error);
  }
}

const renderGalleryItem = (image) => {
  gallery.insertAdjacentHTML(
    "beforeend",
    `<div class="photo-card">
<a href="${image.largeImageURL}">
<img src="${image.webformatURL}" loading="lazy" alt="${image.tags}" />
<div class="info"> </a>
<p class="info-item"><b><strong>Likes</strong></b> ${image.likes}</p>
<p class="info-item"><b><strong>Views</strong></b> ${image.views}</p>
<p class="info-item"><b><strong>Comments</strong></b> ${image.comments}</p>
<p class="info-item"><b><strong>Downloads</strong></b> ${image.downloads}</p>
</div>
</div>`
  );
};
const loadMoreBtn = document.querySelector(".load-more");
const searchBtn = document.querySelector(".search-btn");
searchBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  gallery.innerHTML = "";
  if (searchForm.value !== "") {
    fetchGalleryImage(searchForm.value.trim());
  } else {
    return;
  }
});
if (page === 1 && totalPages !== 0) {
  loadMoreBtn.style.display = "block";
} else {
  loadMoreBtn.style.display = "none";
}
