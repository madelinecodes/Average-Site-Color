
const crawlingBox = document.getElementById('crawlingBox');
const scanningBox = document.getElementById('scanningBox');
const rgbBox = document.getElementById('rgbValText');
const URL = document.getElementById('url');
const infoboxes = document.querySelector('.infoBoxes');  

function render(data) {
    // infoboxes.style.flexDirection = "column";
    try {
       data = JSON.parse(data); 
    } catch (e) {
      console.error(e);
      return;
    }
    if (data.crawling !== undefined) {
          // infoboxes.style.flexDirection = "column";
        var text = document.createElement('div');  
        text.classList.add('text');
        text.innerHTML = `>>> ${data.crawling}\n`;
        crawlingBox.appendChild(text); 
    } else if (data.scanning !== undefined) {
        var text = document.createElement('div');
        text.classList.add('text');
        text.innerHTML = `>>> ${data.scanning}\n`;
        scanningBox.appendChild(text);
    } else if (data.finished !== undefined) {
        spinner();
        if (data.finished.length === 0) {
            scanningBox.innerHTML = 'Error scanning URL or no images found :(';
            document.body.style.backgroundColor = '#f9f9f9';
            makeDark();
            return
        }
        const rgb = data.finished;
        const triple = `(${rgb[0].toFixed(2)} , ${rgb[1].toFixed(2)} , ${rgb[2].toFixed(2)})`;
        rgbBox.innerHTML = triple;
        // Use black/white text to ensure visibility
        if (rgb[0] + rgb[1] + rgb[2] > 382.5) {
            makeDark();
        } else {
            makeLight();
        }
        document.body.style.backgroundColor = `rgb${triple}`;
        var scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }
}

function makeDark() {
    document.body.style.color = 'rgb(0,0,0)';
    document.querySelector('.btn').style.backgroundColor = 'rgb(0,0,0)';
    document.querySelector('.btn').style.color = 'rgb(255,255,255)';
    document.querySelectorAll('.link').forEach(elem => elem.style.color = 'rgb(255,255,255)');
}

function makeLight() {
    document.body.style.color = 'rgb(255,255,255)';
    document.querySelector('.btn').style.backgroundColor = 'rgb(255,255,255)';
    document.querySelector('.btn').style.color = 'rgb(0,0,0)';
    document.querySelectorAll('.link').forEach(elem => elem.style.color = 'rgb(255,255,255)');
}

function crawl() {
    if (!URL.value.split('//')[0].includes('http')) {
      URL.value = `http://${URL.value}`;
    }
    crawlingBox.innerHTML = '';
    scanningBox.innerHTML = '';
    rgbBox.innerHTML = '&nbsp;';
    const ws = new WebSocket(`wss://${document.location.host}/crawler`);
    ws.onmessage = msg => render(msg.data);
    ws.onopen = function (event) {
        ws.send(URL.value);
    }
}

function spinner() {
  var button = document.querySelector('.btn');
  var spinner = document.querySelector('.spinner');
  if ( button.style.display !== 'none') {
    button.style.display = 'none';
    spinner.style.display = 'inline-block';
    }
  else {
    button.style.display = 'inline-block';
    spinner.style.display = 'none';
  }
}

var input = document.getElementById("url");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("submit").click();
    }
});


