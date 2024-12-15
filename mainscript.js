let apiURL = 'https://api.tvmaze.com/';
let id = '';
let data2 ;
let epiurl = `https://api.tvmaze.com/episodes/`;
// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
     
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };

   if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      }, function(error) {
        console.log('Service Worker registration failed:', error);
      });
    });
  }                    
    
  

} // window.onload


// get data from TV Maze
async function searchTvShows() {
  if(searchTvShows == null){
  document.getElementById("main").innerHTML = "Can't find it sorry :(";
    
  }else{
    document.getElementById("main").innerHTML = "";
  
    let search = document.getElementById("search").value;  
     
    try {   
        const response = await fetch(apiURL + 'search/shows?q=' + search);
        const data = await response.json();
        console.log(data);
        showSearchResults(data);
    } catch(error) {
      console.error('Error fetching tv show:', error);
    } // catch
  } // searchTvShows 
} 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
    console.log(data[tvshow])
  } // for

} // updatePage

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   let output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");

    elemDiv.classList.add("divs")
    var elemImage = document.createElement("img");
    elemImage.classList.add("img")

    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.classList.add("gen"); // add a class to apply css

    var elemRating = document.createElement("div");
    elemRating.classList.add("rate"); // add a class to apply css

    var elemSummary = document.createElement("div");
    elemSummary.classList.add("sum"); // add a class to apply css

    
    // add JSON data to elements
    elemImage.src = tvshowJSON.show.image.medium;
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    if(tvshowJSON.show.genres.length === 0){
    elemGenre.innerHTML = "no genres avalabile :(" ;

    }else{
      elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);

    }

    if(tvshowJSON.show.rating.average == null){
      elemRating.innerHTML = "no Rating avalabile :(";
    }else{
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    }
    
    elemSummary.innerHTML = tvshowJSON.show.summary;
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
                            
    // get id of show and add episode list
    let showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
async function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  try {
     const response = await fetch(apiURL + 'shows/' + showId + '/episodes');  
     const data = await response.json();
     console.log("episodes");
     console.log(data);
     showEpisodes(data, elemDiv);
  } catch(error) {
    console.error('Error fetching episodes:', error);
  } // catch
    
} // fetch episodes

async function epiinfo(data) {
  try {
    document.getElementById("message").innerHTML = ''
    id = data
    const res = await fetch(epiurl + id);
    data2 = await res.json();
    console.log(data2 )  
    const Div = document.createElement("div");
    Div.classList.add('lightdiv')
    Div.innerHTML = "<h3>The Episode Name: " + data2.name +"<br>" + "Episode:#"+  data2.number + "</h3>";
    Div.innerHTML += "<h4>Season: "+ data2.season + "</h4>";
   
    if(data2.image == null){
      message.innerHTML += "no image is avaliable";

    }else{
      let img = document.createElement('img');
      img.classList.add('imglight')
      img.src = data2.image.original;
      message.appendChild(img)
    }

    if(data2.summary == null){
      Div.innerHTML += "no summary is provided";
      
    }else{
      Div.innerHTML += data2.summary;

    }
    document.getElementById("message").appendChild(Div) 
    console.log(message)
 } catch(error) {
   console.error('Error fetching episodes:', error);
 } // catch
}


// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
    
    let elemEpisodes = document.createElement("div");  // creates a new div tag
    elemEpisodes.classList.add("epi"); // add a class to apply css
    
    let output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:showLightBox(" + data[episode].id + ")' href = 'javascript:epiinfo(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
    }

    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page

        
} // showEpisodes

// open lightbox and display episode info
function showLightBox(episodeId){
    epiinfo(episodeId) 
     document.getElementById("lightbox").style.display = "block";
     // show episode info in lightbox

     

} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 







