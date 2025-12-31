const searchInput = document.getElementById("search-input")
const searchForm = document.getElementById("search-form")
const moviesPlaceholder = document.getElementById("movies-placeholder")
const movieList = document.getElementById("movie-list")
const moviePlot = document.getElementById("movie-plot")
const watchlistMain = document.getElementById("watchlist-main")
const movieAddedText = document.getElementById("movie-added-text")
const movieExistsText = document.getElementById("movie-exists-text")

const titleWordLimit = 8

// localStorage.clear()

let html = ""
let watchlistHTML = ""

if(searchForm) {
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        
        html = ""
        
        const response = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&apikey=649114e2`)
        const data = await response.json()
        
        if(data.Response === "True") {
            moviesPlaceholder.hidden = true
            
            const basicMovies = data.Search || []
            
            let movies = await Promise.all(
                basicMovies.map(function(movie) {
                    return fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=649114e2`)
                        .then(response => response.json())
                })
            )    
                
            for(let movie of movies) {
                const shownTitle = createExcerpts(movie.Title, titleWordLimit)
                const shownTitleWords = shownTitle.truncated.split(" ")
                const plotTextLimit = shownTitleWords.length < 6 ? 21 : 11
                        
                const moviePlotWords = movie.Plot.split(" ")
                        
                const shownPlot = createExcerpts(movie.Plot, plotTextLimit)
                
                const shouldShowReadMoreBtn = moviePlotWords.length > plotTextLimit ? true : false
                
                const readMoreBtnHTML = shouldShowReadMoreBtn
                ? `<span><button class="read-more-btn" data-full-plot="${movie.Plot}" data-truncated-plot="${shownPlot.truncated}">...Read More</button></span>`
                : ""
                            
                html += `<div class="movie-list-container" id="${movie.imdbID}">
                            <img src="${movie.Poster}" class="movie-poster">
                            <div class="movie-details">
                                <div class="movie-header">
                                    <h2 class="movie-title">${shownTitle.truncated}<span><button data-full-title="${movie.Title}" class="${shownTitle.className} full-title-btn">...</button></span></h2>
                                    <svg class="star-icon" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.8628 0.518241C5.08732 -0.172742 6.06487 -0.172743 6.28939 0.51824L7.09157 2.98709C7.19197 3.2961 7.47994 3.50532 7.80486 3.50532H10.4008C11.1273 3.50532 11.4294 4.43504 10.8416 4.86209L8.74147 6.38792C8.4786 6.5789 8.36861 6.91743 8.46902 7.22644L9.27119 9.69529C9.49571 10.3863 8.70485 10.9609 8.11706 10.5338L6.01693 9.00799C5.75407 8.817 5.39812 8.817 5.13526 9.00799L3.03513 10.5338C2.44734 10.9609 1.65648 10.3863 1.881 9.69529L2.68318 7.22645C2.78358 6.91743 2.67359 6.5789 2.41072 6.38792L0.310596 4.86209C-0.277189 4.43504 0.0248916 3.50532 0.751434 3.50532H3.34733C3.67225 3.50532 3.96022 3.2961 4.06063 2.98709L4.8628 0.518241Z" fill="#FEC654"/>
                                    </svg>
        
                                    <p class="movie-rating">${movie.Ratings[0].Value}</p>
                                </div>
                                <div class="movie-watch">
                                    <p class="movie-">${movie.Runtime}</p>
                                    <p class="movie-">${movie.Genre}</p>
                                    <div class="add-movie" data-imdb-id="${movie.imdbID}" data-title="${movie.Title}" data-poster="${movie.Poster}" data-rating="${movie.Ratings?.[0]?.Value || 'N/A'}" data-plot="${movie.Plot}" data-runtime="${movie.Runtime}" data-genre="${movie.Genre}">
                                        <svg class="add-movies-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM10.125 5.625C10.125 5.00368 9.62132 4.5 9 4.5C8.37868 4.5 7.875 5.00368 7.875 5.625V7.875H5.625C5.00368 7.875 4.5 8.37868 4.5 9C4.5 9.62132 5.00368 10.125 5.625 10.125H7.875V12.375C7.875 12.9963 8.37868 13.5 9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375V10.125H12.375C12.9963 10.125 13.5 9.62132 13.5 9C13.5 8.37868 12.9963 7.875 12.375 7.875H10.125V5.625Z" fill="white"/>
                                        </svg>
                                        <p class="movie-">Watchlist</p>
                                    </div>
                                </div>
                                <p class="movie-plot">${shownPlot.truncated} ${readMoreBtnHTML}</p>
                            </div>
                        </div>
                    `
            }            
            movieList.style.padding = "42px 44px 0 44px"
            
            const movieTitle = document.querySelectorAll(".movie-title")

            movieTitle.forEach((title) =>
            {
                const titleText = title.textContent
            })
            
            searchInput.value = ""
        }
        else {
            html = `
                <p class="not-available-text">Unable to find what you’re looking for. Please try another search.</p>
            `
        }
        
        movieList.innerHTML = html
    })
}

if(movieList) {    
    movieList.addEventListener('click', function(e) {
        readMoreOrLessClicks(e)
        
        if (e.target.classList.contains("full-title-btn")) {
            const fullTitle = e.target.getAttribute("data-full-title")
            
            const parentHeading = e.target.closest(".movie-title")
            
            parentHeading.innerHTML = `${fullTitle}`
        }
        
        if(e.target.classList.contains("add-movie")) {
            const movieDetails = {
                imdbId: e.target.dataset.imdbId,
                title: e.target.dataset.title,
                poster: e.target.dataset.poster,
                rating: e.target.dataset.rating,
                plot: e.target.dataset.plot,
                runtime: e.target.dataset.runtime,
                genre: e.target.dataset.genre
            }
                       
            createWatchlist(movieDetails.imdbId, movieDetails)
        }
    })
}

if (watchlistMain) {
    renderWatchList()
    
    watchlistMain.addEventListener("click", function(e) {
        readMoreOrLessClicks(e)
        
        const removeBtn = e.target.closest(".remove-movie")
        if(removeBtn) {
            const imdbID = e.target.dataset.imdbId
            
            let watchList = getWatchList()
            
            watchList =  watchList.filter(movie => movie.imdbId !== imdbID)
            
            saveWatchList(watchList)
            renderWatchList()   
        }
        else {
            return
        }
    })
}

function readMoreOrLessClicks(e) {
    if(e.target.classList.contains("read-more-btn")) {
            const fullPlot = e.target.getAttribute("data-full-plot")
            const truncatedPlot = e.target.getAttribute("data-truncated-plot")
            
            const parentParagraph = e.target.closest(".movie-plot")
            
            parentParagraph.innerHTML = `${fullPlot} <span><button class="read-less-btn" data-full-plot="${fullPlot}" data-truncated-plot="${truncatedPlot}">...Read Less</button></span>`
        }
        
        if(e.target.classList.contains("read-less-btn")) {
            const fullPlot = e.target.getAttribute("data-full-plot")
            const truncatedPlot = e.target.getAttribute("data-truncated-plot")
            
            const parentParagraph = e.target.closest(".movie-plot")
            
            parentParagraph.innerHTML = `${truncatedPlot} <span><button class="read-more-btn" data-full-plot="${fullPlot}" data-truncated-plot="${truncatedPlot}">...Read More</button></span>`
        }
}

function saveWatchList(watchList) {
    localStorage.setItem("watchList", JSON.stringify(watchList))
}

function getWatchList() {
    return JSON.parse(localStorage.getItem("watchList")) || []
}

function createWatchlist(imdbID, movie) {
    const watchList = getWatchList()
    
    const existingMovie = watchList.find(movie => movie.imdbId === imdbID)
    if(existingMovie) {
        movieExistsText.hidden = false
        
        setTimeout(function() {
            movieExistsText.hidden = true
        }, 1000)
    }
    else {
        watchList.push(
        {
            imdbId: movie.imdbId,
            title: movie.title,
            poster: movie.poster,
            plot: movie.plot,
            rating: movie.rating,
            runtime: movie.runtime,
            genre: movie.genre
        })
        
        movieAddedText.hidden = false
        
        setTimeout(function() {
            movieAddedText.hidden = true
        }, 1000)
    }
    
    saveWatchList(watchList)
}

function renderWatchList() {
    const watchList = getWatchList().slice().reverse()
    
    watchlistHTML = ""
    
    if (watchList.length > 0) {
        for(let movie of watchList) {
            const shownTitle = createExcerpts(movie.title, titleWordLimit)
            const shownTitleWords = shownTitle.truncated.split(" ")
            const plotTextLimit = shownTitleWords.length < 6 ? 21 : 11
                    
            const moviePlotWords = movie.plot.split(" ")
                    
            const shownPlot = createExcerpts(movie.plot, plotTextLimit)
            
            const shouldShowReadMoreBtn = moviePlotWords.length > plotTextLimit ? true : false
            
            const readMoreBtnHTML = shouldShowReadMoreBtn
            ? `<span><button class="read-more-btn" data-full-plot="${movie.plot}" data-truncated-plot="${shownPlot.truncated}">...Read More</button></span>`
            : ""
                
            watchlistHTML += `
                <div class="movie-list-container" id="${movie.imdbId}">
                    <img src="${movie.poster}" class="movie-poster">
                    <div class="movie-details">
                        <div class="movie-header">
                            <h2 class="movie-title">${shownTitle.truncated}<span><button data-full-title="${movie.title}" class="${shownTitle.className} full-title-btn">...</button></span></h2>
                            <svg class="star-icon" width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.8628 0.518241C5.08732 -0.172742 6.06487 -0.172743 6.28939 0.51824L7.09157 2.98709C7.19197 3.2961 7.47994 3.50532 7.80486 3.50532H10.4008C11.1273 3.50532 11.4294 4.43504 10.8416 4.86209L8.74147 6.38792C8.4786 6.5789 8.36861 6.91743 8.46902 7.22644L9.27119 9.69529C9.49571 10.3863 8.70485 10.9609 8.11706 10.5338L6.01693 9.00799C5.75407 8.817 5.39812 8.817 5.13526 9.00799L3.03513 10.5338C2.44734 10.9609 1.65648 10.3863 1.881 9.69529L2.68318 7.22645C2.78358 6.91743 2.67359 6.5789 2.41072 6.38792L0.310596 4.86209C-0.277189 4.43504 0.0248916 3.50532 0.751434 3.50532H3.34733C3.67225 3.50532 3.96022 3.2961 4.06063 2.98709L4.8628 0.518241Z" fill="#FEC654"/>
                            </svg>

                            <p class="movie-rating">${movie.rating}</p>
                        </div>
                        <div class="movie-watch">
                            <p class="movie-">${movie.runtime}</p>
                            <p class="movie-">${movie.genre}</p>
                            <div class="remove-movie" data-imdb-id="${movie.imdbId}" data-title="${movie.title}" data-poster="${movie.poster}" data-rating="${movie.rating}" data-plot="${movie.plot}" data-runtime="${movie.runtime}" data-genre="${movie.genre}">
                                <svg class="remove-movies-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5 7C4.44772 7 4 7.44772 4 8C4 8.55228 4.44772 9 5 9H11C11.5523 9 12 8.55229 12 8C12 7.44772 11.5523 7 11 7H5Z" fill="white"/>
                                </svg>
                                <p class="movie-">Remove</p>
                            </div>
                        </div>
                        <p class="movie-plot">${shownPlot.truncated} ${readMoreBtnHTML}</p>
                    </div>
                </div>
            `
        }
        
        watchlistMain.innerHTML = watchlistHTML
        watchlistMain.style.padding = "42px 44px 0 44px"
    }
    else {
        watchlistMain.innerHTML = `
            <p class="placeholder-text" id="watchlist-placeholder-text">Your watchlist is looking a little empty...</p>
            <a href="index.html" id="more-movies">
                <svg class="more-movies-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18ZM10.125 5.625C10.125 5.00368 9.62132 4.5 9 4.5C8.37868 4.5 7.875 5.00368 7.875 5.625V7.875H5.625C5.00368 7.875 4.5 8.37868 4.5 9C4.5 9.62132 5.00368 10.125 5.625 10.125H7.875V12.375C7.875 12.9963 8.37868 13.5 9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375V10.125H12.375C12.9963 10.125 13.5 9.62132 13.5 9C13.5 8.37868 12.9963 7.875 12.375 7.875H10.125V5.625Z" fill="white"/>
                </svg>
                <p class="placeholder-text more-movies-text">Let’s add some movies!</p>
            </a>
        `
        watchlistMain.style.paddingTop = "211px"
    }
}

function createExcerpts(text, wordLimit) {
    const words = text.split(" ")
    
    if(words.length <= wordLimit) {
        return {
            truncated: text,
            isLong: false,
            className: "hidden"
        }
    }
    else {
        return {
            truncated: words.splice(0, wordLimit).join(" "),
            full: text,
            isLong: true,
            className: ""
        }
    }
}