(function() {

    function replaceLoop() {
        replaceGifImageElements();
        setTimeout(replaceLoop, 1000);
    }

    function replaceGifImageElements() {
        document.querySelectorAll('img:not([data-gif-deanimator-handled])[src*=".gif"]').forEach(function(element) {
            element.setAttribute('data-gif-deanimator-handled', '');
            imageUrlToDataUrlInBackground(element.src, function(err, dataUrl) {
                if (!err) {
                    element.src = dataUrl;
                    element.removeAttribute('data-gif-deanimator-handled');
                }
            });
        });
    }
    
    function imageUrlToDataUrlInBackground(url, callback) {
        chrome.runtime.sendMessage({
            url: url
        }, function(response) {
            if (response.err) {
                callback(response.err);
            } else {
                callback(null, response.dataUrl);
            }
        });
    }

    window.NodeList.prototype.forEach = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback(this[i]);
        };
    };

    replaceLoop();
    
})();
