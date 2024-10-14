// Initialize Quill editor
var quill = new Quill('#editor-container', {
    theme: 'snow', // Choose your theme (e.g., 'snow', 'bubble')
});

// Function to load a post into the text editor for editing
function loadPostForEditing(postKey) {
    firebase.database().ref('blogs/' + postKey).once('value').then(function(snapshot) {
        const post = snapshot.val();

        // Populate the form fields with the post data
        document.getElementById('title').value = post.title || '';
        document.getElementById('author').value = post.author || '';
        document.getElementById('location').value = post.location || '';
        document.getElementById('date').value = post.date || '';
        document.getElementById('category').value = post.category || '';

        // Populate Quill editor with the post content
        quill.clipboard.dangerouslyPasteHTML(post.text || '');

        // Set the post key for editing reference
        document.getElementById('post-form').setAttribute('data-editing-key', postKey);
    }).catch(function(error) {
        alert('Error loading post for editing: ' + error.message);
    });
}

// Function to handle post updating with editor content
function updatePost() {
    const editingKey = document.getElementById('post-form').getAttribute('data-editing-key');

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;

    // Get content from Quill editor
    const postText = quill.root.innerHTML;

    // Prepare updates
    const updates = {
        title: title,
        author: author,
        location: location,
        date: date,
        text: postText,
        category: category
    };

    // Update the post in Firebase
    firebase.database().ref('blogs/' + editingKey).update(updates)
    .then(function() {
        alert('Post updated successfully!');
        document.getElementById('post-form').reset();
        quill.root.innerHTML = '';  // Clear the Quill editor
        document.getElementById('post-form').removeAttribute('data-editing-key');  // Clear the editing key
    }).catch(function(error) {
        alert('Error updating post: ' + error.message);
    });
}

// Bind the updatePost function to the form submit button
document.getElementById('update-button').addEventListener('click', updatePost);

// Example call when editing a post
// loadPostForEditing('POST_KEY_HERE');  // Replace 'POST_KEY_HERE' with actual Firebase key when needed
