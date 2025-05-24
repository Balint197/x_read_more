// Show only relevant instructions based on the browser
document.addEventListener('DOMContentLoaded', function() {
  const isChrome = typeof browser === 'undefined';
  
  if (isChrome) {
    document.getElementById('firefox-instructions').style.display = 'none';
  } else {
    document.getElementById('chrome-instructions').style.display = 'none';
  }
}); 