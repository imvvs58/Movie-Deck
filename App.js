class Movie {
  constructor(id, title, releaseDate, rating, voteCount, posterPath) {
    this.id = id;
    this.title = title;
    this.releaseDate = releaseDate;
    this.rating = rating;
    this.voteCount = voteCount;
    this.posterPath = posterPath;
    this.isFavourite = false;
  }

  createMovieCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    const imgSrc = this.posterPath
      ? `https://image.tmdb.org/t/p/original/${this.posterPath}`
      : 'https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png';
    card.innerHTML = `
    <div>
        <div class="card-image">
            <img src=${imgSrc} alt="${this.title}">
        </div>
        <h3 class="card-name">${this.title}</h3>
        ${this.isFavourite
          ? `<button id="${this.id}-fav-btn" onClick="toggleFavorite(${this.id})">Remove from favorites</button>`
          : `<button id="${this.id}-fav-btn" onClick="toggleFavorite(${this.id})">Add to favorites</button>`
        }
        <button id="${this.id}-btn" onClick="showMore(${this.id}, ${true})">Show more</button>
    </div>
    <div id="${this.id}-details" style="display:none">
        <h4>Release Date - ${this.releaseDate}</h4>
        <h5>Avg Rating - ${this.rating}</h5>
        <h5>Number of Ratings - ${this.voteCount}</h5>
        <button onClick="showMore(${this.id}, ${false})">Show less</button>
    </div>`;
    return card;
  }
}

function toggleFavorite(movieId) {
const movie = movieList.find((movie) => movie.id === movieId);
if(movie.isFavourite){
      movie.isFavourite = false;
  } else {
      movie.isFavourite = true;
 }
 updateFavourites(movie);
 displayMovies(movieList);
}

function updateFavourites(movie){
let favourites = JSON.parse(localStorage.getItem('favourites')) || [];
if(movie.isFavourite){
  favourites.push(movie.id);
}else{
  favourites = favourites.filter(id => id != movie.id);
}
localStorage.setItem('favourites',JSON.stringify(favourites));
}



const showMore = (id, show) => {
  var showMoreButton = document.getElementById(`${id}-btn`);
  var cardDetails = document.getElementById(`${id}-details`);
  if (show) {
      showMoreButton.style.display = 'none';
      cardDetails.style.display = 'block';
  } else {
      showMoreButton.style.display = 'block';
      cardDetails.style.display = 'none';
  }
};

const url =
'https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=1';
let movieList = [];

function displayMovies(movieList) {
  const cardDisplay = document.getElementById('card-display');
  cardDisplay.innerHTML = '';
  if (movieList.length === 0) {
      const noResultMessage = document.createElement('p');
      noResultMessage.innerText = 'No results found.';
      cardDisplay.appendChild(noResultMessage);
  } else {
      movieList.forEach((movie) => {
      
      if(currentTab == "fav" && !movie.isFavourite)return;
      
      const card = movie.createMovieCard();
      cardDisplay.appendChild(card);
      });
  }
}


let currentTab = "all";
function handleTabsChange(event){
const previousTab = document.querySelector(`li[value=${currentTab}]`);
previousTab.classList.remove('active');
currentTab = event.target.getAttribute('value');
event.target.classList.add('active');
displayMovies(movieList);
}

const fetchMovies = async () => {
  const data = await fetch(url);
  const jsonData = await data.json();
  movieList = jsonData.results.map(
      (movie) =>
      new Movie(
          movie.id,
          movie.title,
          movie.release_date,
          movie.vote_average,
          movie.vote_count,
          movie.poster_path
      )
  );
  loadFavourites();
  displayMovies(movieList);
};

function loadFavourites(){
const favourites = JSON.parse(localStorage.getItem('favourites'));
if(!favourites)return;
movieList.forEach((movie) => {
    if(favourites.includes(movie.id)){
      movie.isFavourite = true;
    }
})
}

function sortMovies(array, order) {
  if (order === "rating-asc") {
    return array.sort((a, b) => a.rating - b.rating);
  } else if (order === "rating-desc") {
    return array.sort((a, b) => b.rating - a.rating);
  } else if (order === "release-asc"){
    return array.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
  } else {
    return array.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  }
}

function handleSortChange(event) {
  const sortBy = event.target.value;
  movieList = sortMovies(movieList, sortBy)
  displayMovies(movieList)
}

function handleSearchInput(event) {
  const searchText = event.target.value;
  const filteredMovies = movieList.filter(movie => movie.title.toLowerCase().includes(searchText.toLowerCase()));
  displayMovies(filteredMovies);
}

function init () {
  const sortBySelect = document.getElementById('sort-by');
  sortBySelect.addEventListener('change', handleSortChange);
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', handleSearchInput);
  const tabs = document.querySelectorAll('.tabs .tab');
  tabs.forEach(tab => tab.addEventListener('click', handleTabsChange))
  fetchMovies();
}

init();

/* 
arr = [{
          
          "id": 238,
          "poster_path": "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          "release_date": "1972-03-14",
          "title": "The Godfather",
          "vote_average": 8.7,
          "vote_count": 18007,
          "isFavourite":"true",
          createMovieCard:function(){}
          238-btn
          <button id="238-fav-btn" onClick="toggleFavorite(${this.id})">Add to favorites</button>`
      },
      {
          
          "id": 278,
          "poster_path": "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          "release_date": "1994-09-23",
          "title": "The Shawshank Redemption",
          "vote_average": 8.7,
          "vote_count": 23849,
          "isFavourite":"false",
           createMovieCard:function(){}
           278-btn
      },
      {
          "id": 240,
          "poster_path": "/bMadFzhjy9T7R8J48QGq1ngWNAK.jpg",
          "release_date": "1974-12-20",
          "title": "The Godfather Part II",
          "vote_average": 8.6,
          "vote_count": 10875,
          "isFavourite":"false",
           createMovieCard:function(){}
           240-btn
      }]  */
