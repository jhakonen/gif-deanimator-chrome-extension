(function() {

    var browserActionState = 'off';

    refreshBrowserActionButton();

    chrome.browserAction.onClicked.addListener(function () {
        toggleBrowserActionState();
        sendMessageToAllTabs({
            type: 'change-state',
            browserActionState: browserActionState
        });
    });

    function toggleBrowserActionState() {
        browserActionState = (browserActionState == 'on')? 'off': 'on';
        refreshBrowserActionButton();
    }
    
    function refreshBrowserActionButton() {
        var isOn = browserActionState == 'on';

        chrome.browserAction.setTitle({
            title: isOn? 'Enable GIF animations': 'Disable GIF animations'
        });
        chrome.browserAction.setBadgeText({
            text: isOn? 'on': 'off'
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: isOn? '#0A0': '#777'
        });
    }
    
    function sendMessageToAllTabs(message) {
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, message);
            });
        });
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
        switch (request.type) {
            case 'image-url-to-data-url':
                imageUrlToDataUrl(request.url, function(err, url) {
                    if (err) {
                        sendResponse({
                            err: 'error occured loading the image'
                        });
                    } else {
                        sendResponse({
                            dataUrl: url
                        });
                    }
                });
                return true;
            
            case 'get-state':
                sendResponse(browserActionState);
                break;

            default:
                sendResponse();
        }
    });
    
    function imageUrlToDataUrl(url, callback) {
        var image = new Image();
        image.src = url;

        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            callback(null, canvas.toDataURL());
        };
        image.onerror = function() {
            callback('error occured loading the image');
        }
    }

})();
