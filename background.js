(function() {

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
        var image = new Image();
        image.src = request.url;

        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            sendResponse({
                dataUrl: canvas.toDataURL()
            });
        };
        image.onerror = function() {
            sendResponse({
                err: 'error occured loading the image'
            });
        }
        
        return true;
    });

})();
