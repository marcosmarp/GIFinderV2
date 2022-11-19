function getUserInput() {
  // @ts-ignore
  return document.getElementById("search_text").value;
}

function hideKeyboard() {
  setTimeout(function() {
    var field = document.createElement('input');
    field.setAttribute('type', 'text');
    field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
    document.body.appendChild(field);
    field.onfocus = function(){
      setTimeout(function() {
        field.setAttribute('style', 'display:none;');
        setTimeout(function() {
          document.body.removeChild(field);
          document.body.focus();
        }, 14);
      }, 200);
    };
    field.focus();
  }, 50);
}

function pushToDOM(response) {
  response = JSON.parse(response);
  let container = document.getElementById("gif");
  let images = response.data;
  container.innerHTML = "";
  var received_gifs = [];

  console.time("Gifs recovery");
  images.forEach(function (image) {
    console.log("recovered gif from data");
    let src = image.images.fixed_height.url;
    let gif_temp = "\<img src='" + src + "' class='container-image' />";
    console.log(gif_temp);
    received_gifs.push(gif_temp);
  });
  console.log("all gifs recovered");
  console.timeEnd("Gifs recovery");

  console.time("Gifs display");
  for (let i = 0 ; i < received_gifs.length ; ++i) {
    console.log("sending gif to container");
    container.innerHTML += received_gifs[i];
  }
  console.log("all gifs sent to container");
  console.timeEnd("Gifs display");
}

function searchGif(key_words) {
  console.time("Data request");
  console.log("started gifs request");
  let api_url = "https://api.giphy.com/v1/gifs/search?api_key=A4whMgEB0rIiQzVl4HLG7paNS26dNi4z&q=" + key_words;

  let api_AJAX_call = new XMLHttpRequest();
  api_AJAX_call.open("GET", api_url);
  api_AJAX_call.send();


  api_AJAX_call.addEventListener("load", function (data) {
    console.log("received data from request")
    console.timeEnd("Data request");
    // @ts-ignore
    pushToDOM(data.target.response);
  });
}

function highlightButton() {
  document.getElementById("search_button").style.backgroundColor = "rgb(5, 54, 104)";
  document.getElementById("search_button").style.color = "white";
}

function restoreButton() {
  document.getElementById("search_button").style.backgroundColor = "rgb(158, 104, 209)";
  document.getElementById("search_button").style.color = "white";
}

let is_touch = window.matchMedia("(pointer: coarse)").matches;

if (!is_touch) {
  console.log("mouse-based input");
  document.getElementById("search_button").addEventListener("mouseover", function () {
    console.log("mouse over search button");
    highlightButton();
  });
  document.getElementById("search_button").addEventListener("mouseout", function() {
    console.log("mouse left search button");
    restoreButton();
  });

  document.getElementById("search_button").addEventListener("mousedown", function () { 
    console.log("clicking button");
    });
  document.getElementById("search_button").addEventListener("mouseup", function () {
    console.log("button released");
    searchGif(getUserInput());
    });
}
else {
  console.log("touch-based input");
  document.getElementById("search_button").addEventListener("touchstart", function () { 
    console.log("touching button");
    highlightButton();
    });
  document.getElementById("search_button").addEventListener("touchend", function () {
    console.log("button released");
    restoreButton();
    hideKeyboard();
    searchGif(getUserInput());
    });
}

document.getElementById("search_text").addEventListener("keydown", function (key) {
  if (key.which === 13) {
    console.log("enter key pressed in text box"); 
    highlightButton();
  }
});

document.getElementById("search_text").addEventListener("keyup", function (key) {
  if (key.which === 13) { 
    console.log("enter key released in text box")
    restoreButton();
    if (is_touch) hideKeyboard();
    searchGif(getUserInput());
  }
});