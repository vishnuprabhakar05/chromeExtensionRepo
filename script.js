var intervalId;

function searchForConnectButtons() {
  var currentIndex = 0;
  var buttonArray = [];

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, { code: `
      var connectButtons = document.querySelectorAll('button');
      var connectButtonIds = [];
      for (var i = 0; i < connectButtons.length; i++) {
        var button = connectButtons[i];
        if (button.innerText === 'Connect') {
          connectButtonIds.push(button.id);
        }
      }
      console.log('Number of connect buttons found:', connectButtonIds.length);
      console.log('Connect button ids:', connectButtonIds);

      buttonArray = connectButtonIds.map(function(id) {
        return document.getElementById(id);
      });

      var currentIndex = 0;
      intervalId = setInterval(function() {
        if (currentIndex >= buttonArray.length) {
          clearInterval(intervalId);
          document.getElementById('clickBtn').disabled = false;
          return;
        }

        var currentButton = buttonArray[currentIndex];

        if (currentButton.disabled) {
          console.log(\`Button \${currentButton.id} is disabled\`);
         
          currentIndex++;
          return;
        }

        currentButton.click();
      
        var popupIntervalId = setInterval(function() {
          var sendButton = document.querySelector('button[aria-label="Send now"], button[aria-label="Send invitation"]');
          if (sendButton) {
            sendButton.click();
            clearInterval(popupIntervalId);
          }
        }, 1000);

        setTimeout(function() {
          console.log(\`Button \${currentButton.id} is enabled\`);
          currentIndex++;
        }, 2000);
      }, 2000);
    `});
  });
}

var clickBtn = document.getElementById('clickBtn');

clickBtn.addEventListener('click', function() {
  if (clickBtn.innerHTML === 'Start Connecting') {
    clickBtn.disabled = true;
    searchForConnectButtons();
  } else {
    clearInterval(intervalId);
    clickBtn.disabled = false;
  }
});
