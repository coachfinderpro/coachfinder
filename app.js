function getSearchInput(event) {
  event.preventDefault();
  clearData();
  let searchInput = document.getElementById('searchinput').value;
  if (searchInput) {
    getDataFromApi("search?q=" + searchInput);
  }
  else {
    const searchAgain = document.createElement('p');
    searchAgain.textContent = "Enter a Name, Color, or Style to Search"
    results.appendChild(searchAgain);
  }
}
  
function getDataFromApi(searchInput) {
  fetch(`https://coach-finder.herokuapp.com/api/v1/parts/${searchInput}`)
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      response.json().then(function(data) {
        if (searchInput !== "rando") {
          renderResultInfo(data, searchInput)
        }
        else {renderResults(data)}
      });
      document.getElementById('searchinput').value = '';
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });
}

function renderResultInfo(data, searchInput) {
  if (data && data.length) {
    const resultName = searchInput.replace('search?q=','');
    const resultInfo = document.getElementById('resultInfo');
    resultInfo.textContent = `${data.length}` + ' results for ' + `${resultName}` + ':';
    if (data.length <= 12) {
      renderResults(data);
    }
    else {renderSubArray(data)};
  }
  else {
    const searchAgain = document.createElement('p');
    searchAgain.textContent = "No results. Try a different search."
    results.appendChild(searchAgain);
  }
}

let dataArr;
let currentPage = 1;
let startIndex = 0;
let endIndex = 12;
function renderSubArray(data) {
  dataArr = data;
  const pageCount = Math.ceil(dataArr.length / 12);
  const subArray = data.slice(startIndex, endIndex);
  renderResults(subArray);
  if (currentPage < pageCount) {
    document.getElementById("loadmore").style.visibility = "visible";
    currentPage ++;
    startIndex += 12;
    endIndex += 12;
  }
  else {
    document.getElementById("loadmore").style.visibility = "hidden";
    currentPage = 1;
    startIndex = 0;
    endIndex = 12;
  }
}

function renderResults(data) {
  data.forEach(renderEachResult);
  function renderEachResult(eachResult, index) {
    const results = document.getElementById('results');
    const catalogPage = document.createElement('li');
    const nameAndDate = document.createElement('p');
    const imageLink = document.createElement('a');
    const image = document.createElement('img');
    nameAndDate.textContent = (`${data[index].catalog_name}`).replace(/_/g, ' ') + " " +`${data[index].year}`;
    image.src=(`${data[index].img_url}`).replace('http', 'https');
    results.appendChild(catalogPage);
    catalogPage.appendChild(nameAndDate);
    catalogPage.appendChild(imageLink);
    imageLink.setAttribute('href',`${data[index].img_url}`);
    imageLink.setAttribute('target','_blank');
    imageLink.appendChild(image);
  }
}

function clearData() {
  document.getElementById("resultInfo").textContent = '';
  const oldResults = document.getElementById("results");
  while (oldResults.firstChild) {
    oldResults.removeChild(oldResults.firstChild);
  }
  document.getElementById("loadmore").style.visibility = "hidden";
}

getDataFromApi("rando");
