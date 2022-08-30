# Front-end install

- Get [repository](https://github.com/Jerrad-Johnson/WorkoutAppRedo) 
- Run `npm install` in project folder 
- Update `queries.tsx` variable `baseURL` to reference your php directory

# Back-end install 

- Get [repository](https://github.com/Jerrad-Johnson/WorkoutAppBackend)
- Create a database
- Create `connect.php` and `sendgridKey.php` in parent php folder. Sample formats:
### connect.php
```
<?php

$servername = "localhost";
$username = "someusername";
$password = "somepassword";
$db = "workoutapp";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$db", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    standardizedResponse($e->getMessage());
    return;
}

?>
```
### sendgridKey.php
```
<?php
$sendgridKey = "Your key goes here";
?>
```
- Run setupTables.php

## TODO / Known issues

- Loading indicators on Progress page do not disappear after a failed fetch.
- Home page needs an “Update” button, so old sessions can be changed without being deleted first.
- Need the option to remove specific execises from current session. This way e.g. if good-and-bad exercises are ordered as OXOOO, it won’t be necessary to remove the OOO at the end to get rid of X (because exercises are currently removed end-first)
- Users need the option to download their entire session history, so that they never have to rely on my database / risk losing all of their history.
- MUI button recoloring needed for home page.
- Couldn’t find a way to not render success messages with react-hot-toast. Partial solution was to set the success-message timeout to 1ms.
- Need to update e-mail address so that messages come from my domain, rather than (presently) from my school e-mail address.
- Many DOM elements should fade upon data load / etc.
- Needs Cypress tests.
- Needs to inform users when server has ended their session (when they get logged out).



