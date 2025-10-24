<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Check if request is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get all request files
$data_dir = __DIR__ . '/data/';
$all_requests = [];

if (is_dir($data_dir)) {
    $files = glob($data_dir . 'website-requests-*.json');
    
    foreach ($files as $file) {
        if (file_exists($file)) {
            $file_data = json_decode(file_get_contents($file), true);
            if (is_array($file_data)) {
                $all_requests = array_merge($all_requests, $file_data);
            }
        }
    }
}

// Sort by submission date (newest first)
usort($all_requests, function($a, $b) {
    return strtotime($b['submitted_at']) - strtotime($a['submitted_at']);
});

echo json_encode([
    'success' => true,
    'requests' => $all_requests,
    'total' => count($all_requests)
]);
?>
