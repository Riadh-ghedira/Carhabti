

<html>
<body>
    <h2>hello</h2>
    <form
          method="get"
          enctype="multipart/form-data"
        >
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Jhon Doe"
            autocomplete="name"
            required
          />
          <p class="error" id="name-error"></p>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            autocomplete="email"
            required
          />
          <p class="error" id="email-error"></p>
          <label for="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
          />
          <p class="error" id="password-error"></p>
          <label for="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autocomplete="new-password"
            required
          />
          <p class="error" id="confirmpassword-error"></p>
          <button id="sub-btn" type="submit">Sign up</button>
          <p class="msg">
            you already have an account?
            <a href="login.html" class="bleu">Login</a>
          </p>
        </form>
</body>


</html>
<?php
   if (isset($_GET['submit'])) {
    $name = $_GET['name'];
    $email = $_GET['email'];
    $password = $_GET['password'];
    $confirmPassword = $_GET['confirmPassword'];
   } 
   if ($password != $confirmPassword) {
    echo" wrong password";
   }
?>
