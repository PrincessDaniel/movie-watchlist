const searchInput = document.getElementById("search-input")
const searchForm = document.getElementById("search-form")
const moviesPlaceholder = document.getElementById("movies-placeholder")
const movieList = document.getElementById("movie-list")
const moviePlot = document.getElementById("movie-plot")

const titleWordLimit = 8


let html = ""

searchForm.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    html = ""
    movieList.textContent = ""
    
    const response = await fetch(`https://www.omdbapi.com/?s=${searchInput.value}&apikey=649114e2`)
    const data = await response.json()
    // console.log(data)
    
    moviesPlaceholder.hidden = true
    
    const basicMovies = data.Search
    
    const movies = await Promise.all(
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
        
        
        //  console.log(shownTitle.truncated)
        
        html += `<div class="movie-list-container">
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
                            <div class="add-movie">
                                <button class="add-movie-btn">
                                    <svg class="add-movie-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM9 5C9 4.44772 8.55228 4 8 4C7.44772 4 7 4.44772 7 5V7H5C4.44772 7 4 7.44771 4 8C4 8.55228 4.44772 9 5 9H7V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9V5Z" fill="white"/>
                                    </svg>
                                </button>
                                <p class="movie-">Watchlist</p>
                            </div>
                        </div>
                        <p class="movie-plot">${shownPlot.truncated} ${readMoreBtnHTML}</p>
                    </div>
                </div>
            `
    }
 
    movieList.innerHTML = html
    
    movieList.style.padding = "42px 44px 0 44px"
    
    const movieTitle = document.querySelectorAll(".movie-title")

    movieTitle.forEach((title) =>
    {
        const titleText = title.textContent
        // console.log(titleText)
    })
    
    // searchInput.value = ""
})

movieList.addEventListener('click', function(e) {
    if(e.target.classList.contains("read-more-btn")) {
        const fullPlot = e.target.getAttribute("data-full-plot")
        const truncatedPlot = e.target.getAttribute("data-truncated-plot")
        
        const parentParagraph = e.target.closest(".movie-plot")
        
        
        parentParagraph.innerHTML = `${fullPlot} <span><button class="read-less-btn" data-full-plot="${fullPlot}" data-truncated-plot="${truncatedPlot}">...Read Less</button></span>`
    }
    // else {
    //     return
    // }
    
    if(e.target.classList.contains("read-less-btn")) {
        const fullPlot = e.target.getAttribute("data-full-plot")
        const truncatedPlot = e.target.getAttribute("data-truncated-plot")
        
        const parentParagraph = e.target.closest(".movie-plot")
        
        parentParagraph.innerHTML = `${truncatedPlot} <span><button class="read-more-btn" data-full-plot="${fullPlot}" data-truncated-plot="${truncatedPlot}">...Read More</button></span>`
    }
    
    if (e.target.classList.contains("full-title-btn")) {
        const fullTitle = e.target.getAttribute("data-full-title")
        
        const parentHeading = e.target.closest(".movie-title")
        
        parentHeading.innerHTML = `${fullTitle}`
    }
})

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

// fetch("https://www.omdbapi.com/?s=thrones&apikey=649114e2")
//     .then(response => response.json())
//     .then(data => console.log(data.search.ratings))