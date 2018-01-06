# express-reuse-local-login

`express-reuse-local-login` is a strategy for `express-reuse`. For a detailed explanation on getting started, see the documentation [here](https://github.com/airjp73/express-reuse/wiki/Getting-Started).

Here are the things you need to know to use this package specifically:

### Email Templates

If you want to use transactional emails, this strategy expects you to have these email templates:

```
emails
  - emailConfirm
  - emailConfirmThankYou
  - forgotPassword
  - passwordChanged
```

### Database fields

This strategy expects your user data in your database to have the following fields:

```
//Required
email:      String
password:   String

//Only required if using transactional emails
confirmEmailToken:    String
emailConfirmed:       Boolean
resetPasswordToken:   String
resetPasswordExpires: Date
```
