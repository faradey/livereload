chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.actionType === "reload") {
            let paths = request.path.split("/");
            paths.reverse();
            let transformer = "";
            let isMatch = false;
            paths.forEach((val, i, arr) => {
                let elms = document.querySelectorAll("link[href*='" + val + "']");
                if (isMatch === false) {
                    if (elms.length !== 1) {
                        if (transformer) {
                            transformer = val + "/" + transformer;
                        } else {
                            transformer = val;
                        }
                    } else {
                        isMatch = true;
                        let queryString = '?reload=' + new Date().getTime();
                        elms[0].href = elms[0].href.replace(/\?.*|$/, queryString);
                    }
                }
            });
            sendResponse({actionType: "reload", result: "ok"});
            return;
        } else if(request.actionType === "error"){
            alert(request.message);
        }
        sendResponse({actionType: "unknown", result: "unknown"});
    }
);