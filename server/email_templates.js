Accounts.emailTemplates.siteName = 'Bittheodds.com';
Accounts.emailTemplates.from = "Bittheodds Accounts <no-reply@bittheodds.com>";


Accounts.emailTemplates.resetPassword.subject = function () {
    return 'Instructions on how to reset your password';
};
Accounts.emailTemplates.resetPassword.text = function (user, url) {
   return 'Dear ' + user.username + '\n\n'
   + 'You have requested for your password to be reset.\n'
   + 'If you did not make this request it is safe to ignore this email.\n\n'
   + 'To reset your password, please click the link below:\n\n'
   + url + '\n\n';
};


Accounts.emailTemplates.verifyEmail.subject = function () {
    return 'Please verify your email address';
};
Accounts.emailTemplates.verifyEmail.text = function (user, url) {
   return 'Dear ' + user.username + '\n\n'
   + 'In order to keep your account safe you must verify your email address.\n'
   + 'To do so, simply click the link below:\n\n'
   + url + '\n\n';
};
