// Number of posts per page
const POSTS_PER_PAGE = 6;
let currentPage = 1; // Track current page for pagination

// Function to upload a new blog post
function upload() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value || 'Anonymous';  // Optional field
    var location = document.getElementById('location').value || 'Unknown'; // Optional field
    var date = document.getElementById('date').value || new Date().toISOString().split('T')[0];  // Default to today's date if not provided
    var postText = document.getElementById('post').value;
    var image = document.getElementById('image').files[0];
    var category = document.getElementById('category').value || 'General'; // Default to 'General' category

    if (!title || !postText) {
        alert("Please provide both title and post content!");
        return;
    }

    var postKey = firebase.database().ref().child('blogs').push().key;  // Generate new key for the post

    // Handle case when no image is uploaded
    if (image) {
        var imageName = image.name;
        var storageRef = firebase.storage().ref('images/' + imageName);
        var uploadTask = storageRef.put(image);

        uploadTask.on('state_changed', function (snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
        }, function (error) {
            console.log(error.message);
        }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                savePostToDatabase(postKey, title, author, location, date, postText, downloadURL, category);
            });
        });
    } else {
        // If no image, just save the post without an image URL
        savePostToDatabase(postKey, title, author, location, date, postText, '', category);
    }
}

// Helper function to save post data to the Firebase Realtime Database
function savePostToDatabase(postKey, title, author, location, date, postText, imageURL, category) {
    firebase.database().ref('blogs/' + postKey).set({
        title: title,
        author: author,
        location: location,
        date: date,
        text: postText,
        imageURL: imageURL,
        category: category
    }, function (error) {
        if (error) {
            alert("Error while uploading post: " + error.message);
        } else {
            alert("Post uploaded successfully!");
            document.getElementById('post-form').reset();
        }
    });
}


// Function to retrieve posts from Firebase and paginate them
function getdata(pageNumber = 1, selectedCategory = null) {
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        const data = snapshot.val();
        let posts = [];

        for (let key in data) {
            posts.push({
                key: key,
                title: data[key].title,
                author: data[key].author || "Anonymous",
                date: data[key].date || "Date Unknown",
                text: data[key].text || "",
                imageURL: data[key].imageURL,
                category: data[key].category || ""
            });
        }

        // Filter posts if category is selected
        if (selectedCategory) {
            posts = posts.filter(post => post.category === selectedCategory);
        } else {
            posts.sort((a, b) => (a.date < b.date) ? 1 : -1);
        }

        const startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;

        displayPosts(posts.slice(startIndex, endIndex));
        generatePaginationLinks(posts.length, selectedCategory);
    });
}

// Function to display posts
function displayPosts(posts) {
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('col-lg-4');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');

        const postImage = document.createElement('img');
        postImage.classList.add('card-img-top');
        postImage.src = post.imageURL || 'https://dummyimage.com/700x350/ccc/000'; // Placeholder image if no image available

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const postTitle = document.createElement('h2');
        postTitle.classList.add('card-title');
        postTitle.textContent = post.title;

        // Strip HTML tags for the post excerpt preview
        const plainText = stripHTML(post.text);
        const postExcerpt = document.createElement('p');
        postExcerpt.classList.add('card-text');
        postExcerpt.textContent = plainText.substring(0, 70) + '...';

        const readMoreLink = document.createElement('a');
        readMoreLink.href = 'post.html?key=' + post.key;
        readMoreLink.classList.add('btn', 'btn-primary');
        readMoreLink.textContent = 'Read More →';

        cardBody.appendChild(postTitle);
        cardBody.appendChild(postExcerpt);
        cardBody.appendChild(readMoreLink);

        card.appendChild(postImage);
        card.appendChild(cardBody);

        postElement.appendChild(card);
        postsContainer.appendChild(postElement);
    });
}

// Function to generate pagination
function generatePaginationLinks(totalPosts, selectedCategory) {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const paginationList = document.querySelector('.pagination');
    paginationList.innerHTML = '';

    if (totalPages > 1) {
        const newerLink = document.createElement('li');
        newerLink.classList.add('page-item');
        newerLink.innerHTML = `<a class="page-link" href="#">Newer</a>`;
        newerLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                getdata(currentPage, selectedCategory);
            }
        });
        paginationList.appendChild(newerLink);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('li');
            pageLink.classList.add('page-item');
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                getdata(currentPage, selectedCategory);
            });
            paginationList.appendChild(pageLink);
        }

        const olderLink = document.createElement('li');
        olderLink.classList.add('page-item');
        olderLink.innerHTML = `<a class="page-link" href="#">Older</a>`;
        olderLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                getdata(currentPage, selectedCategory);
            }
        });
        paginationList.appendChild(olderLink);
    }
}

// Function to search posts
function searchPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear posts

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        const data = snapshot.val();
        const filteredPosts = [];

        for (let key in data) {
            const post = data[key];
            if (post.title.toLowerCase().includes(searchTerm) || post.text.toLowerCase().includes(searchTerm)) {
                filteredPosts.push({ key, ...post });
            }
        }

        displayPosts(filteredPosts);
    });
}

// Function to filter posts by category
function filterByCategory(category) {
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    // Retrieve all posts from Firebase and filter by category
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        const data = snapshot.val();
        let filteredPosts = [];

        for (let key in data) {
            const post = data[key];
            if (post.category === category) {
                filteredPosts.push({ key, ...post });
            }
        }

        // Display the filtered posts
        if (filteredPosts.length > 0) {
            displayPosts(filteredPosts);
        } else {
            postsContainer.innerHTML = `<p>No posts found for category "${category}".</p>`;
        }
    }).catch(function (error) {
        console.error("Error filtering posts by category: ", error);
    });
}

// Function to populate categories dynamically
function populateCategories() {
    const categoriesContainer = document.querySelector('.category-link-container');
    categoriesContainer.innerHTML = ''; // Clear previous categories

    // Retrieve all posts from Firebase and extract unique categories
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        const data = snapshot.val();
        const categoriesSet = new Set();

        for (let key in data) {
            const post = data[key];
            if (post.category) {
                categoriesSet.add(post.category);
            }
        }

        // Populate categories dynamically
        const categories = Array.from(categoriesSet).sort();
        categories.forEach(category => {
            const categoryElement = document.createElement('li');
            categoryElement.innerHTML = `<a href="#!" class="category-link" onclick="filterByCategory('${category}')">${category}</a>`;
            categoriesContainer.appendChild(categoryElement);
        });
    });
}

// Function to strip HTML tags and limit content length
function stripHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";  // Get plain text
}

// Call the necessary functions on page load
window.onload = function() {
    populateCategories(); // Populate the categories
    getdata(); // Load the posts
};
