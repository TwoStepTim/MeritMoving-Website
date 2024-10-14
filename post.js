// Get the post key from the URL parameter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const postKey = urlParams.get('key');

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyD9t3-Posz7kwqPYUNO2Fuqr3reJk85HU",
  authDomain: "test-blog-267b4.firebaseapp.com",
  databaseURL: "https://test-blog-267b4-default-rtdb.firebaseio.com",
  projectId: "test-blog-267b4",
  storageBucket: "test-blog-267b4.appspot.com",
  messagingSenderId: "792098821482",
  appId: "1:792098821482:web:26ff52d2c6907702360113",
  measurementId: "G-3Z0Q1YWCNH",
};
firebase.initializeApp(firebaseConfig);

/// Function to display post details and remove placeholders
function displayPostDetails(postKey) {
  firebase.database().ref('blogs/' + postKey).once('value').then(function(snapshot) {
    const postData = snapshot.val();

    // Populate post details
    document.getElementById('post-title').textContent = postData.title || 'Post Title';
    document.getElementById('post-date').textContent = postData.date || 'Date Unknown';
    document.getElementById('post-author').textContent = postData.author || 'Author Unknown';
    document.getElementById('post-body').innerHTML = postData.text || 'No content available';

    // Display the post image (if available)
    const imageURL = postData.imageURL;
    if (imageURL) {
      document.getElementById('post-image').src = imageURL;
      document.getElementById('post-body-image').src = imageURL;
    }

    // Remove the skeleton classes once content is loaded
    document.getElementById('post-title').classList.remove('skeleton-text');
    document.getElementById('post-date').classList.remove('skeleton-text');
    document.getElementById('post-author').classList.remove('skeleton-text');
    document.getElementById('post-body').classList.remove('skeleton-text');
    document.getElementById('post-image').classList.remove('skeleton-image');
    document.getElementById('post-body-image').classList.remove('skeleton-image');
  });
}

// Function to populate categories
function populateCategories() {
  firebase.database().ref('blogs/').once('value').then(function(snapshot) {
    const data = snapshot.val();
    let categoriesSet = new Set();

    // Get all categories
    for (let key in data) {
      const post = data[key];
      if (post.category) {
        categoriesSet.add(post.category);
      }
    }

    // Populate categories in the sidebar
    const categoriesContainer = document.querySelector('.category-link-container');
    categoriesContainer.innerHTML = '';
    categoriesSet.forEach(category => {
      const categoryElement = document.createElement('li');
      categoryElement.innerHTML = `<a href="index.html?category=${category}">${category}</a>`;
      categoriesContainer.appendChild(categoryElement);
    });
  });
}

// Function to display recent posts
// Function to display recent posts
function displayRecentPosts() {
    firebase.database().ref('blogs/').limitToLast(3).once('value').then(function(snapshot) {
      const data = snapshot.val();
      const recentPostsList = document.getElementById('recent-posts-list');
      recentPostsList.innerHTML = '';
  
      for (let key in data) {
        const post = data[key];
  
        // Create list item
        const postItem = document.createElement('li');
        postItem.classList.add('list-group-item', 'recent-post-item');
  
        // Media object for image
        const mediaObject = document.createElement('div');
        mediaObject.classList.add('media-object', 'pull-left');
  
        const postImage = document.createElement('img');
        postImage.src = post.imageURL || 'https://dummyimage.com/80x80/ccc/000'; // Placeholder image if no image available
        postImage.classList.add('img-responsive');
        mediaObject.appendChild(postImage);
  
        // Media body for text (date and title)
        const mediaBody = document.createElement('div');
        mediaBody.classList.add('media-body');
  
        const postDate = document.createElement('h5');
        postDate.textContent = post.date || 'Unknown Date';
        mediaBody.appendChild(postDate);
  
        const postTitle = document.createElement('h4');
        postTitle.classList.add('media-heading');
  
        const postLink = document.createElement('a');
        postLink.href = `post.html?key=${key}`;
        postLink.textContent = post.title;
        postTitle.appendChild(postLink);
  
        mediaBody.appendChild(postTitle);
  
        // Append media object and media body to list item
        postItem.appendChild(mediaObject);
        postItem.appendChild(mediaBody);
  
        // Append list item to recent posts list
        recentPostsList.appendChild(postItem);
      }
    });
  }
  

// Call functions to display post, categories, and recent posts
displayPostDetails(postKey);
populateCategories();
displayRecentPosts();
