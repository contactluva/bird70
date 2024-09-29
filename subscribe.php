
<?php
// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the email from the form
    $email = $_POST['email'];

    // Validate the email address
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // If valid, process the email (e.g., save to database or send confirmation)
        
        // Example: Send a confirmation email
        $to = $email;
        $subject = "Thank you for subscribing!";
        $message = "You have successfully subscribed to our newsletter.";
        $headers = "From: no-reply@yourwebsite.com";

        if (mail($to, $subject, $message, $headers)) {
            // Send a success response to the AMP form
            header('Content-Type: application/json');
            echo json_encode(['result' => 'success', 'message' => ' Thank you for subscribing.']);
        } else {
            // Send an error response if the email could not be sent
            header('Content-Type: application/json');
            echo json_encode(['result' => 'error', 'message' => 'Failed to send the confirmation email.']);
        }
    } else {
        // If the email is not valid, send an error response
        header('Content-Type: application/json');
        echo json_encode(['result' => 'error', 'message' => 'Invalid email address. Please enter a valid email.']);
    }
} else {
    // If the request is not POST, return an error
    header('Content-Type: application/json');
    echo json_encode(['result' => 'error', 'message' => 'Invalid request method.']);
}
?>
