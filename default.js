// default.js

const POSTS_PER_PAGE = 6; // Number of posts to display per page

// Function to upload a new blog post
function upload() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var location = document.getElementById('location').value;
    var date = document.getElementById('date').value;
    var post = document.getElementById('post').value;
    var image = document.getElementById('image').files[0];
    var category = document.getElementById('category').value; // Get selected category

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
            firebase.database().ref('blogs/').push().set({
                title: title,
                author: author,
                location: location,
                date: date,
                text: post,
                imageURL: downloadURL,
                category: category // Save category in the database
            }, function (error) {
                if (error) {
                    alert("Error while uploading");
                } else {
                    alert("Successfully uploaded");
                    document.getElementById('post-form').reset();
                    // Refresh data after uploading
                    getdata(currentPage);
                }
            });
        });
    });
}

// Function to get posts from Firebase and paginate them
function getdata(pageNumber = 1, selectedCategory = null) {
    firebase.database().ref('blogs/').once('value').then(function (snapshot) {
        var data = snapshot.val();
        var posts = [];

        // Convert Firebase snapshot to array of posts
        for (let key in data) {
            posts.push({
                key: key,
                title: data[key].title,
                author: data[key].author || "Anonymous",
                date: data[key].date || "Date Unknown",
                text: data[key].text || "",
                imageURL: data[key].imageURL,
                category: data[key].category || "" // Retrieve category
            });
        }

        // Filter posts by selected category (if any)
        if (selectedCategory) {
            // Filter posts matching the selected category
            var matchingPosts = posts.filter(post => post.category === selectedCategory);

            // Sort matching posts by date (most recent first)
            matchingPosts.sort((a, b) => (a.date < b.date) ? 1 : -1);

            // Remove matching posts from the main posts array
            posts = posts.filter(post => post.category !== selectedCategory);

            // Concatenate matching posts at the beginning of the main posts array
            posts = matchingPosts.concat(posts);
        } else {
            // Sort all posts by date (most recent first)
            posts.sort((a, b) => (a.date < b.date) ? 1 : -1);
        }

        // Calculate start and end index for the current page
        var startIndex = (pageNumber - 1) * POSTS_PER_PAGE;
        var endIndex = startIndex + POSTS_PER_PAGE;

        // Display posts for the current page
        displayPosts(posts.slice(startIndex, endIndex));

        // Generate pagination links
        generatePaginationLinks(posts.length);
    });
}


// Function to display posts in the new layout
function displayPosts(posts) {
    var otherPostsContainer = document.getElementById('other-posts');

    // Clear previous posts
    otherPostsContainer.innerHTML = '';

    // Loop through each post and create HTML elements
    for (let i = 0; i < posts.length; i++) {
        var post = posts[i];
        var col = document.createElement('div');
        col.classList.add('col-md-4', ); // Adjust the column width as needed

        var card = document.createElement('div');
        card.classList.add('card', 'blog-post');

        var image = document.createElement('img');
        image.src = post.imageURL;
        image.classList.add('card-img-top');
        image.alt = 'Post Image';

        var cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        var title = document.createElement('h4');
        title.classList.add('card-title');
        title.textContent = post.title;
        
         // Create author element
         var authorElement = document.createElement('h5');
         authorElement.classList.add('card-text', 'author');
         authorElement.textContent =  post.author;

        var date = document.createElement('p');
        date.classList.add('card-text', 'date');
        date.textContent = 'Published ' + post.date;

        var text = document.createElement('p');
        text.classList.add('card-text', 'maintext');
        text.textContent = post.text.substring(0, 200) + '....'; // Limit text to 200 characters followed by "...."

        var readMoreLink = document.createElement('a');
        readMoreLink.href = 'post.html?key=' + post.key; // Set the href attribute to post.html?key= + the post key
        readMoreLink.classList.add('btn', 'btn-primary');
        readMoreLink.textContent = 'Read More';

        // Append elements to cardBody
        cardBody.appendChild(title);
        cardBody.appendChild(authorElement);
        cardBody.appendChild(date);
        cardBody.appendChild(text);
        cardBody.appendChild(readMoreLink);

        // Append elements to card
        card.appendChild(image);
        card.appendChild(cardBody);

        // Append card to column
        col.appendChild(card);

        // Append column to otherPostsContainer
        otherPostsContainer.appendChild(col);
        // Within the displayPosts function
// Create card with category information
card.setAttribute('data-category', post.category);

    }
}


// Initialize the current page variable
let currentPage = 1;

// Function to generate pagination links
function generatePaginationLinks(totalPosts) {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const paginationList = document.querySelector('.pagination');

    // Clear existing pagination links
    paginationList.innerHTML = '';

    // Generate pagination links if there are multiple pages
    if (totalPages > 1) {
        // Add "Newer" link
        const newerLink = document.createElement('li');
        newerLink.classList.add('page-item');
        newerLink.innerHTML = `<a class="page-link" href="#">Newer</a>`;
        newerLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                getdata(currentPage);
            }
        });
        paginationList.appendChild(newerLink);

        // Add numbered links
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('li');
            pageLink.classList.add('page-item');
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                getdata(currentPage);
            });
            paginationList.appendChild(pageLink);
        }

        // Add "Older" link
        const olderLink = document.createElement('li');
        olderLink.classList.add('page-item');
        olderLink.innerHTML = `<a class="page-link" href="#">Older</a>`;
        olderLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                getdata(currentPage);
            }
        });
        paginationList.appendChild(olderLink);
    }
}
// Function to search posts based on the search term
function searchPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    // Retrieve all posts from Firebase
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        const data = snapshot.val();
        let filteredPosts = [];

        // Loop through each post and check if the search term is in the title or content
        for (let key in data) {
            const post = data[key];
            const postTitle = post.title.toLowerCase();
            const postText = post.text.toLowerCase();

            if (postTitle.includes(searchTerm) || postText.includes(searchTerm)) {
                filteredPosts.push({ key, ...post });
            }
        }

        // Display the filtered posts
        if (filteredPosts.length > 0) {
            displaySearchResults(filteredPosts);
        } else {
            resultsContainer.innerHTML = '<p>No results found for "' + searchTerm + '".</p>';
        }
    });
}

// Function to display the search results
function displaySearchResults(posts) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Clear previous results

    posts.forEach(post => {
        // Create HTML structure for each post
        const postElement = document.createElement('div');
        postElement.classList.add('col-lg-6');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-4');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const postTitle = document.createElement('h5');
        postTitle.classList.add('card-title');
        postTitle.textContent = post.title;

        const postExcerpt = document.createElement('p');
        postExcerpt.classList.add('card-text');
        postExcerpt.textContent = post.text.substring(0, 150) + '...'; // Show first 150 characters of the post

        const readMoreLink = document.createElement('a');
        readMoreLink.href = 'post.html?key=' + post.key;
        readMoreLink.classList.add('btn', 'btn-primary');
        readMoreLink.textContent = 'Read More';

        // Append elements to card body
        cardBody.appendChild(postTitle);
        cardBody.appendChild(postExcerpt);
        cardBody.appendChild(readMoreLink);

        // Append card body to card
        card.appendChild(cardBody);

        // Append card to postElement
        postElement.appendChild(card);

        // Append postElement to results container
        resultsContainer.appendChild(postElement);
    });
}
// Function to search posts based on the search term
function searchPosts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    // Retrieve all posts from Firebase
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        const data = snapshot.val();
        let filteredPosts = [];

        // Loop through each post and check if the search term is in the title or content
        for (let key in data) {
            const post = data[key];
            const postTitle = post.title.toLowerCase();
            const postText = post.text.toLowerCase();

            if (postTitle.includes(searchTerm) || postText.includes(searchTerm)) {
                filteredPosts.push({ key, ...post });
            }
        }

        // Display the filtered posts
        if (filteredPosts.length > 0) {
            displayPosts(filteredPosts);
        } else {
            postsContainer.innerHTML = '<p>No results found for "' + searchTerm + '".</p>';
        }
    });
}

// Function to display posts in the normal blog layout
function displayPosts(posts) {
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    posts.forEach(post => {
        // Create HTML structure for each post
        const postElement = document.createElement('div');
        postElement.classList.add('col-lg-4');

        const card = document.createElement('div');
        card.classList.add('card', 'mb-');

        const postImage = document.createElement('img');
        postImage.classList.add('card-img-top');
        postImage.src = post.imageURL || 'https://dummyimage.com/700x350/ccc/000'; // Placeholder image if no image available

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const postTitle = document.createElement('h2');
        postTitle.classList.add('card-title');
        postTitle.textContent = post.title;

        const postExcerpt = document.createElement('p');
        postExcerpt.classList.add('card-text');
        postExcerpt.textContent = post.text.substring(0, 150) + '...'; // Show first 150 characters of the post

        const readMoreLink = document.createElement('a');
        readMoreLink.href = 'post.html?key=' + post.key;
        readMoreLink.classList.add('btn', 'btn-primary');
        readMoreLink.textContent = 'Read More →';

        // Append elements to card body
        cardBody.appendChild(postTitle);
        cardBody.appendChild(postExcerpt);
        cardBody.appendChild(readMoreLink);

        // Append image and card body to card
        card.appendChild(postImage);
        card.appendChild(cardBody);

        // Append card to post element
        postElement.appendChild(card);

        // Append post element to posts container
        postsContainer.appendChild(postElement);
    });
}

// Function to retrieve and display categories from Firebase
function populateCategories() {
    const categoriesContainer = document.querySelector('.category-link-container');
    categoriesContainer.innerHTML = ''; // Clear previous categories

    // Retrieve all posts from Firebase to get the categories
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        const data = snapshot.val();
        let categoriesSet = new Set();

        // Loop through each post and collect unique categories
        for (let key in data) {
            const post = data[key];
            if (post.category) {
                categoriesSet.add(post.category); // Add each category to the Set (to avoid duplicates)
            }
        }

        // Convert Set to Array and sort categories alphabetically
        const categories = Array.from(categoriesSet).sort();

        // Populate the categories section dynamically
        categories.forEach(category => {
            const categoryElement = document.createElement('li');
            categoryElement.innerHTML = `<a href="#!" class="category-link" onclick="filterByCategory('${category}')">${category}</a>`;
            categoriesContainer.appendChild(categoryElement);
        });
    });
}

// Function to filter posts based on category
function filterByCategory(category) {
    const postsContainer = document.getElementById('other-posts');
    postsContainer.innerHTML = ''; // Clear previous posts

    // Retrieve all posts from Firebase
    firebase.database().ref('blogs/').once('value').then(function(snapshot) {
        const data = snapshot.val();
        let filteredPosts = [];

        // Loop through each post and check if the category matches
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
    });
}

// Call the populateCategories function when the page loads
populateCategories();



// Call the getdata function with the initial page number
getdata();


