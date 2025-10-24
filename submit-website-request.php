<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'company', 'website_type', 'budget', 'timeline', 'features', 'message'];
$missing_fields = [];

foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        $missing_fields[] = $field;
    }
}

if (!empty($missing_fields)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required fields: ' . implode(', ', $missing_fields)
    ]);
    exit;
}

// Validate email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Sanitize input data
$data = [
    'name' => htmlspecialchars(trim($input['name'])),
    'email' => filter_var($input['email'], FILTER_SANITIZE_EMAIL),
    'phone' => htmlspecialchars(trim($input['phone'])),
    'company' => htmlspecialchars(trim($input['company'])),
    'website_type' => htmlspecialchars(trim($input['website_type'])),
    'budget' => htmlspecialchars(trim($input['budget'])),
    'timeline' => htmlspecialchars(trim($input['timeline'])),
    'features' => is_array($input['features']) ? implode(', ', array_map('htmlspecialchars', $input['features'])) : htmlspecialchars(trim($input['features'])),
    'message' => htmlspecialchars(trim($input['message'])),
    'submitted_at' => date('Y-m-d H:i:s')
];

// Save to file (you can replace this with database storage)
$filename = 'website-requests-' . date('Y-m') . '.json';
$filepath = __DIR__ . '/data/' . $filename;

// Create data directory if it doesn't exist
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Load existing data
$existing_data = [];
if (file_exists($filepath)) {
    $existing_data = json_decode(file_get_contents($filepath), true) ?: [];
}

// Add new request
$existing_data[] = $data;

// Save data
if (file_put_contents($filepath, json_encode($existing_data, JSON_PRETTY_PRINT))) {
    // Send email notification (optional)
    $to = 'info@digitalsolutions.com'; // Replace with your email
    $subject = 'New Website Request - ' . $data['company'];
    $message = "
    New website request received:
    
    Name: {$data['name']}
    Email: {$data['email']}
    Phone: {$data['phone']}
    Company: {$data['company']}
    Website Type: {$data['website_type']}
    Budget: {$data['budget']}
    Timeline: {$data['timeline']}
    Features: {$data['features']}
    Message: {$data['message']}
    
    Submitted: {$data['submitted_at']}
    ";
    
    $headers = 'From: noreply@digitalsolutions.com' . "\r\n" .
               'Reply-To: ' . $data['email'] . "\r\n" .
               'X-Mailer: PHP/' . phpversion();
    
    // Uncomment the line below to enable email notifications
    // mail($to, $subject, $message, $headers);
    
    echo json_encode([
        'success' => true, 
        'message' => 'Your website request has been submitted successfully! We will contact you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save request. Please try again.']);
}
?>
