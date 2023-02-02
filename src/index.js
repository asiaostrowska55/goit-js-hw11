import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-form__input");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
loadMoreBtn.classList.add("btn-hidden");

let page = 1;
let per_page = 40;

const lightBox = new SimpleLightbox(".gallery a");
const axios = require("axios").default;

async function fetchGalleryImage(search) {
  try {
    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: "33257268-27ad9fcecc17d6e2546f4b9dc",
        q: search,
        image_type: "photo",
        orientation: "horizonatal",
        safesearch: true,
        per_page,
        page,
      },
    });
    const data = response.data.hits;
    data.forEach((photo) => {
      renderGalleryItem(photo);
    });
    if (response.data.totalHits > 0 && page === 1) {
      Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
        timeout: 2000,
      });
    } else if (response.data.totalHits === 0) {
      Notify.failure(
        "Sorry, there are no images matching your search query. Please try again."
      );
    }
    lightBox.refresh();

    totalPages = Math.ceil(response.data.totalHits / per_page);

    if (totalPages >= page) {
      loadMoreBtn.classList.replace("btn-hidden", "btn-visible");
      loadMoreBtn.addEventListener("click", (e) => {
        page += 1;
        fetchGalleryImage(search);
      });
      const { height: cardHeight } =
        gallery.firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    } else if (page > totalPages && page !== 1) {
      Notify.info("You've reached the end of search results");
      loadMoreBtn.disabled = true;
    }
  } catch (error) {
    console.log(error);
  }
}

const renderGalleryItem = (image) => {
  gallery.insertAdjacentHTML(
    "beforeend",
    `<div class="photo-card">
<a href="${image.largeImageURL}">
<img src="${image.webformatURL}" loading="lazy" alt="${image.tags}" /> 
</a>
<div class="info"> 
<p class="info-item"><b><strong>Likes</strong></b> ${image.likes}</p>
<p class="info-item"><b><strong>Views</strong></b> ${image.views}</p>
<p class="info-item"><b><strong>Comments</strong></b> ${image.comments}</p>
<p class="info-item"><b><strong>Downloads</strong></b> ${image.downloads}</p>
</div>
</div>`
  );
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  gallery.innerHTML = "";
  if (searchInput.value !== "") {
    fetchGalleryImage(searchInput.value);
    return;
  } else {
    // Notify.failure(
    //   ("Sorry, there are no images matching your search query. Please try again.",
    //   {
    //     timeout: 2000,
    //   })
    // );
  }
});
