const bcrypt = require("bcrypt");

bcrypt.hash("your_password_here", 10).then(console.log);
