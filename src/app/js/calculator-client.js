(function () {

    window.addEventListener('load', addEvents);

    function addEvents() {
        var calculateButton = document.getElementById('calculate');
        calculateButton.addEventListener('click', function(event) {
            var expressionInput = document.getElementById('expression');
            var resultSpan = document.getElementById('result');
            var expression = expressionInput.value.trim();
            if (expression === '') {
                resultSpan.innerHTML = 'Please insert an expression...';
            } else {
                resultSpan.innerHTML = sendRequestToCalculator(expression);
            }
        });
    }

    function sendRequestToCalculator(expression) {
        var jsonExpression = JSON.stringify({'expression': expression});
        var resultSpan = document.getElementById('result');

        getRequestPromise('POST', 'http://localhost:5555/evaluate', jsonExpression)
            .then(function(result) {
                resultSpan.innerHTML = result;
            }).catch(function(error) {
                resultSpan.innerHTML = "An error occurred: " + error.message;
            });
    }

    function getRequestPromise(method, url, jsonBody) {
        var requestPromise = new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open(method, url);
            req.addEventListener('load', function() {
                if (req.status === 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            });
            req.addEventListener('error', function() {
                reject(Error(req.statusText));
            });

            req.setRequestHeader('Content-Type', 'application/json');
            req.send(jsonBody);
        });

        return requestPromise.then(function(results) {
            return JSON.parse(results).result;
        });
    }

})();