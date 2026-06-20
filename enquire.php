<?php
declare(strict_types=1);

/**
 * Juhsone enquiry endpoint.
 * Validate -> honeypot -> email Andy -> append backup log (outside docroot).
 * Mirrors the proven youraccentcoach.com mail() + envelope-sender method.
 * Must be on the nginx PHP allow-list (location = /enquire.php).
 */

$TO   = 'andy@youraccentcoach.com';
$FROM = 'noreply@youraccentcoach.com';          // proven-deliverable sender on this box
$LOG  = '/var/www/juhsone-data/enquiries.log';  // OUTSIDE the web root

$wantsJson = (stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false)
          || (($_POST['ajax'] ?? '') === '1');

function respond(bool $ok, int $code, string $err = ''): void {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($ok ? ['ok' => true] : ['ok' => false, 'error' => $err]);
    } else {
        header('Location: /?sent=' . ($ok ? '1' : '0'));
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(false, 405, 'method');

// strip ALL control chars (incl CR/LF -> no header injection), trim, length-cap
$clean = static function ($v, int $max): string {
    $s = is_string($v) ? $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]/', '', $s) ?? $s;
    return substr(trim($s), 0, $max);
};

// honeypot: bots fill the hidden "website" field -> pretend success, drop it
if (trim((string)($_POST['website'] ?? '')) !== '') respond(true, 200);

$name    = $clean($_POST['name']    ?? '', 100);
$email   = $clean($_POST['email']   ?? '', 160);
$message = $clean($_POST['message'] ?? '', 4000);

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 422, 'invalid');
}

$subject = 'Juhsone enquiry — ' . $name;
if (preg_match('/[^\x20-\x7E]/', $subject)) {            // MIME-encode non-ASCII subjects
    $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
}

$body = "New enquiry from juhsone.com\n\n"
      . "Name:  $name\n"
      . "Email: $email\n\n"
      . "Message:\n$message\n";

$headers = 'From: Juhsone <' . $FROM . ">\r\n"
         . 'Reply-To: ' . $email . "\r\n"          // reply goes straight to the customer
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: juhsone-enquire\r\n";

$ok = @mail($TO, $subject, $body, $headers, '-f' . $FROM);

// backup log so nothing is ever lost, even if mail() fails
@file_put_contents(
    $LOG,
    date('c') . "\t" . ($ok ? 'sent' : 'MAILFAIL') . "\t$name\t$email\t"
        . str_replace(["\n", "\t"], ' ', $message) . "\n",
    FILE_APPEND | LOCK_EX
);

respond((bool) $ok, $ok ? 200 : 500, 'send');
