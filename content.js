(function() {

    var replaceLoopId = null;

    function startReplaceLoop() {
        if (replaceLoopId === null) {
            replaceLoopId = setInterval(replaceGifImageElements, 1000);
        }
    }

    function stopReplaceLoop() {
        clearInterval(replaceLoopId);
        replaceLoopId = null;
    }

    function revertImagesToOriginalUrls() {
        document.querySelectorAll('img[data-gif-deanimator-original-url]').forEach(function(element) {
            element.src = element.getAttribute('data-gif-deanimator-original-url');
            element.removeAttribute('data-gif-deanimator-original-url');
        });
    }
    
    function replaceGifImageElements() {
        document.querySelectorAll('img:not([data-gif-deanimator-original-url])[src*=".gif"]').forEach(function(element) {
            element.setAttribute('data-gif-deanimator-original-url', element.src);
            imageUrlToDataUrlInBackground(element.src, function(err, dataUrl) {
                if (!err) {
                    element.src = dataUrl;
                }
            });
        });
    }
    
    function imageUrlToDataUrlInBackground(url, callback) {
        chrome.runtime.sendMessage({
            type: 'image-url-to-data-url',
            url: url
        }, function(response) {
            callback(response.err, response.dataUrl);
        });
    }

    window.NodeList.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i]);
        };
    };

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        switch (request.type) {
            case 'change-state':
                var isOn = request.browserActionState == 'on';
                if (isOn) {
                    startReplaceLoop();
                } else {
                    stopReplaceLoop();
                    revertImagesToOriginalUrls();
                }
                sendResponse();
                break;
            
            default:
                sendResponse();
        }
    });

    // start replacing if the extension is toggled on
    chrome.runtime.sendMessage({
        type: 'get-state'
    }, function(response) {
        if (response == 'on') {
            startReplaceLoop();
        }
    });

})();
