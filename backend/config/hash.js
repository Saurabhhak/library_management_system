const bcrypt = require("bcrypt");
bcrypt.hash("JWTSRECT", 64).then(console.log);