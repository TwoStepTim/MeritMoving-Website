import os

# Define the folder containing the images
image_folder = 'img\gallery'

# Open or create the HTML file to write to
html_file = 'gallery.html'

# Start building the HTML structure
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Image Gallery</title>
    <link rel="stylesheet" href="path_to_your_css_file.css">
</head>
<body>
    <div class="container my-5">
        <div class="row">
"""

# Loop through each file in the folder and add it to the gallery
for filename in os.listdir(image_folder):
    if filename.endswith(('.jpg', '.jpeg', '.png', '.gif')):  # Filter for image files
        # Append each image to the HTML gallery
        html_content += f"""
        <div class="col-lg-4 col-md-6 mb-4">
            <img src="{os.path.join(image_folder, filename)}" alt="{filename}" class="img-fluid gallery-img" onclick="openLightbox(this)">
        </div>
        """

# Close the divs and body of the HTML
html_content += """
        </div>
    </div>

    <!-- Lightbox HTML -->
    <div id="lightbox" class="lightbox">
        <span class="close" onclick="closeLightbox()">&times;</span>
        <div class="row">
            <div class="col-12 text-center mt-5">
                <img class="lightbox-content" id="lightbox-img">
            </div>
        </div>
    </div>

    <script src="path_to_your_js_file.js"></script>
</body>
</html>
"""

# Write the generated HTML to the file
with open(html_file, 'w') as file:
    file.write(html_content)

print(f"Gallery HTML has been created and saved to {html_file}")
