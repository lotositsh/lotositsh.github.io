function copyCode(index) {
  // Get the code block by index
  var codeBlock = document.getElementsByClassName("code")[index - 1];

  // Highlight the code block
  codeBlock.style.backgroundColor = "#EAF2F8";
  setTimeout(function() {
    codeBlock.style.backgroundColor = "white";
  }, 500);

  // Copy the code to clipboard
  var range = document.createRange();
  range.selectNode(codeBlock);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();
}

//scroll
window.addEventListener('scroll', function() {
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollPosition > 300) {
    document.querySelector('.scroll-to-top').style.display = 'block';
  } else {
    document.querySelector('.scroll-to-top').style.display = 'none';
  }
});
