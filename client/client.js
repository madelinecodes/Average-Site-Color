
const crawlingBox = document.getElementById('crawlingBox');
const scanningBox = document.getElementById('scanningBox');
const rgbBox = document.getElementById('rgbValue');
const URL = document.getElementById('url');

function render(data) {
    data = JSON.parse(data);

    if (data.crawling !== undefined) {
        crawlingBox.innerHTML += `>>> ${data.crawling}\n`;
    } else if (data.scanning !== undefined) {
        scanningBox.innerHTML += `>>> ${data.scanning}\n`;
    } else if (data.finished !== undefined) {
        if (data.finished.length === 0) {
            scanningBox.innerHTML = 'Error scanning URL or no images found :(';
        }
        const rgb = data.finished;
        const triple = `(${rgb[0].toFixed(2)} , ${rgb[1].toFixed(2)} , ${rgb[2].toFixed(2)})`;
        rgbBox.innerHTML = triple;
        // Use black/white text to ensure visibility
        if (rgb[0] + rgb[1] + rgb[2] > 382.5) {
            document.body.style.color = 'rgb(0,0,0)';
        } else {
            document.body.style.color = 'rgb(255,255,255)';
        }
        document.body.style.backgroundColor = `rgb${triple}`;
    }
}

function crawl() {
    crawlingBox.innerHTML = '';
    scanningBox.innerHTML = '';
    rgbBox.innerHTML = '';
    const ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = msg => render(msg.data);
    ws.onopen = function (event) {
        ws.send(URL.value);
    }
}

var input = document.getElementById("url");
input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("submit").click();
    }
});
