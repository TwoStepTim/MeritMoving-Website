<?php
// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data and sanitize inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $phone = htmlspecialchars(trim($_POST['phone']));
    $email = htmlspecialchars(trim($_POST['email']));
    $move_type = htmlspecialchars(trim($_POST['move_type']));
    $truck_provision = htmlspecialchars(trim($_POST['truck_provision']));
    $move_size = htmlspecialchars(trim($_POST['move_size']));
    $stairs = htmlspecialchars(trim($_POST['stairs']));
    $mattresses = htmlspecialchars(trim($_POST['mattresses']));
    $wrapping = htmlspecialchars(trim($_POST['wrapping']));
    $special_items = isset($_POST['special_items']) ? $_POST['special_items'] : [];
    $disassembly = htmlspecialchars(trim($_POST['disassembly']));
    $move_date = htmlspecialchars(trim($_POST['move_date']));
    $starting_address = htmlspecialchars(trim($_POST['starting_address']));
    $ending_address = htmlspecialchars(trim($_POST['ending_address']));
    $referral = htmlspecialchars(trim($_POST['referral']));
    $additional_info = htmlspecialchars(trim($_POST['additional_info']));

    // Handle checkboxes (special items) - Convert array to a string
    $special_items_str = !empty($special_items) ? implode(", ", array_map('htmlspecialchars', $special_items)) : 'None';

    // Your company's email
    $to = 'meritmoving919@gmail.com'; // Replace with your company's email address
    $subject = 'New Merit Moving Quote Request';

    // Email body content for the company
    $message = "
    <html>
    <head>
        <title>New Merit Moving Quote Request</title>
    </head>
    <body>
        <h2>Form Submission Received</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Move Type:</strong> $move_type</p>
        <p><strong>Truck Provision:</strong> $truck_provision</p>
        <p><strong>Move Size:</strong> $move_size</p>
        <p><strong>Stairs:</strong> $stairs</p>
        <p><strong>Mattresses:</strong> $mattresses</p>
        <p><strong>Wrapping:</strong> $wrapping</p>
        <p><strong>Special Items:</strong> $special_items_str</p>
        <p><strong>Disassembly:</strong> $disassembly</p>
        <p><strong>Move Date:</strong> $move_date</p>
        <p><strong>Starting Address:</strong> $starting_address</p>
        <p><strong>Ending Address:</strong> $ending_address</p>
        <p><strong>Referral:</strong> $referral</p>
        <p><strong>Additional Info:</strong> $additional_info</p>
    </body>
    </html>
    ";

    // Email headers for the company
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: meritmoving919@gmail.com
" . "\r\n"; // Replace with your domain

    // Send the email to the company
    mail($to, $subject, $message, $headers);

    // Send a thank you email to the respondent
    $recipientEmail = $email;
    $thankYouSubject = 'Thank you for your submission';
    $thankYouMessage = 'Dear ' . $name . ",\n\n";
    $thankYouMessage .= 'Thank you for choosing Merit Moving for your upcoming move! We have received your quote request, and our team is working diligently to provide you with a personalized quote.' . "\n\n";
    $thankYouMessage .= 'We will get back to you as soon as we can with a detailed quote. In the meantime, feel free to reach out to us if you have any questions or specific requests. Call 919-345-4202 or email us at meritmoving919@gmail.com.' . "\n\n";
    $thankYouMessage .= 'Best regards,' . "\n";
    $thankYouMessage .= 'Merit Moving';

    // Email headers for the respondent (plain text)
    $thankYouHeaders = "From: meritmoving919@gmail.com" . "\r\n"; // Replace with your domain

    // Send the thank you email
    if (mail($recipientEmail, $thankYouSubject, $thankYouMessage, $thankYouHeaders)) {
        echo "Your quote request has been sent successfully! A confirmation email has been sent to you.";
    } else {
        echo "Failed to send your quote request. Please try again.";
    }
}
?>
