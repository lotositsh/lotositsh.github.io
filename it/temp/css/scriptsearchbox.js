  document.getElementById('searchLink').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    var searchBox = document.getElementById('searchBox');
    if (searchBox.style.display === 'none' || searchBox.style.display === '') {
      searchBox.style.display = 'block';
    } else {
      searchBox.style.display = 'none';
    }
  });