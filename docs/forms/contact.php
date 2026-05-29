<?php
/**
 * Simple contact form endpoint.
 * - Returns plain text "OK" on success for validate.js compatibility.
 * - Validates required fields server-side.
 * - Sends message to primary inbox.
 * - Optionally forwards to a phone via carrier SMS-email gateway.
 */

declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit('Method not allowed');
}

// Primary destination email (recommended: your Outlook inbox).
$receiving_email_address = 'kannigakaushik@outlook.com';

// Optional: SMS/email gateway address for your phone number.
// Direct email to a phone number is not universal. If your carrier provides
// an email-to-SMS gateway, place it here (example format only):
// $phone_gateway_address = '35389XXXXXXX@sms.carrier-domain.com';
$phone_gateway_address = '';

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
  http_response_code(400);
  exit('All fields are required.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  exit('Please provide a valid email address.');
}

$clean_name = preg_replace('/[\r\n]+/', ' ', $name) ?? $name;
$clean_subject = preg_replace('/[\r\n]+/', ' ', $subject) ?? $subject;

$email_subject = 'Portfolio Contact: ' . $clean_subject;
$email_body = "You received a new message from your portfolio contact form.\n\n"
  . "Name: {$clean_name}\n"
  . "Email: {$email}\n"
  . "Subject: {$clean_subject}\n\n"
  . "Message:\n{$message}\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: Portfolio Contact <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>';
$headers[] = 'Reply-To: ' . $email;

$header_string = implode("\r\n", $headers);

$sent_primary = @mail($receiving_email_address, $email_subject, $email_body, $header_string);
if (!$sent_primary) {
  http_response_code(500);
  exit('Unable to send email at this time.');
}

if ($phone_gateway_address !== '' && filter_var($phone_gateway_address, FILTER_VALIDATE_EMAIL)) {
  $sms_subject = 'Portfolio msg from ' . $clean_name;
  $sms_body = $clean_name . ': ' . $message;
  @mail($phone_gateway_address, $sms_subject, $sms_body, $header_string);
}

echo 'OK';
