document.addEventListener("DOMContentLoaded", function () {
  var video = document.getElementById("myVideo");
  var overlay = document.querySelector(".video-overlay");

  var videoHeight = video.offsetHeight;
  var windowHeight = window.innerHeight;
  var maxScroll = document.body.offsetHeight - windowHeight;
  
  function updateVideo() {
    var scrollPercentage = (window.scrollY / maxScroll) * 100;
    overlay.style.opacity = 1 - scrollPercentage / 10;
  }
  
  window.addEventListener("scroll", updateVideo);
});

$(document).ready(function() {
  // Toggle the sidebar when the hamburger is clicked
  $(".hamburger").click(function() {
    $(".sidebar").toggleClass("open");
  });
});
$(document).ready(function() {
  var isAnimated = false;

  $(window).scroll(function() {
    if (!isAnimated) {
      var meetTeamOffset = $('.MeetTeam').offset().top;
      if ($(window).scrollTop() > meetTeamOffset - ($(window).height() / 2)) {
        $('.MATT').addClass('fade-in-animation').css('opacity', 1);
        setTimeout(function() {
          $('.Dazz').addClass('fade-in-animation').css('opacity', 1);
        }, 500); // Delay Dazz fade-in by 500 milliseconds
        isAnimated = true;
      }
    }
  });
});

  // Get references to the video and trigger elements
const video = document.getElementById('myVideo'); // Change 'myVideo' to the actual ID of your video element
const trigger = document.getElementById('video-trigger');

// Function to start the video
function startVideo() {
  video.play();
}

// Intersection Observer configuration
const options = {
  root: null, // Use the viewport as the root
  rootMargin: '0px',
  threshold: 0.5, // When 50% of the trigger element is in the viewport
};

// Callback function when the trigger element enters the viewport
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Start the video when the trigger is in view
      startVideo();

      // Stop observing to prevent multiple triggers
      observer.unobserve(trigger);
    }
  });
}

// Create an Intersection Observer
const observer = new IntersectionObserver(handleIntersection, options);

// Start observing the trigger element
observer.observe(trigger);

