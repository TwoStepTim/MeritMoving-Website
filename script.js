$(document).ready(function() {
    // Function to load the content of the selected page
    function loadPageContent(url) {
      $.ajax({
        url: url,
        type: 'GET',
        success: function(response) {
          $('#page-content').html(response);
        },
        error: function() {
          $('#page-content').html('<p>Error loading content.</p>');
        }
      });
    }
  
    var pageLinks = $('header ul li a');
  
    // Function to set the active link
    function setActiveLink(linkElement) {
      pageLinks.parent().removeClass('active');
      linkElement.parent().addClass('active');
    }
  
    // Get the current URL path
    var currentPath = window.location.pathname;
  
    // Set the active class on the initially loaded page
    var currentPageLink = $('header ul li a[href="' + currentPath + '"]');
    if (currentPageLink.length > 0) {
      setActiveLink(currentPageLink);
      loadPageContent(currentPath); // Load the content of the initially active page
    }
  
    // Add click event listeners to each page link
    pageLinks.on('click', function(event) {
      event.preventDefault();
      setActiveLink($(this));
      var nextPage = $(this).attr('href');
      loadPageContent(nextPage); // Load the content of the selected page
      window.history.pushState(null, null, nextPage); // Update the URL without page reload
    });
  });
  