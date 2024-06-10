const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createDefaultUser = async () => {
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: 'admin@example.com' },   
      defaults: {
        username: 'admin',
        email: 'admin@example.com',
        phoneNumber: '1234567890',
        password: 'securepassword'
      }
    });

    if (created) {
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }
  } catch (error) {
    console.error('Error creating default user:', error);
  }
};

createDefaultUser();


const register = async (req, res) => {
    try {
        const existingAdminUser = await User.findOne({ where: { email: "admin@example.com" } });

        if (existingAdminUser) {
            return res.status(403).json({
                message: "Admin user already registered.",
            });
        }

        const { username, email, phoneNumber, password } = req.body;

        if (!username || !email || !phoneNumber || !password) {
            res.status(403);
            res.send(`required parameters missing, 
                        example request body:
                    {
                        "username": "abc name",
                        "email": "abc email",
                        "password": "abc password",
                        "phoneNumber": "abc phoneNumber"
                      } `);
            return;
        }

        req.body.email = req.body.email.toLowerCase();

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userCreated = await User.create({
            username,
            email,
            phoneNumber,
            password: hashedPassword,
            isAdmin: false, // Default value for isAdmin
        });

        const token = jwt.sign({ userId: userCreated.id, email: userCreated.email }, "Hassan_Nadeem", { expiresIn: "1h" });

        res.status(201).json({
            message: "Registration successful",
            token,
            user: {
                userId: userCreated.id,
                username: userCreated.username,
                email: userCreated.email,
                phoneNumber: userCreated.phoneNumber,
                isAdmin: userCreated.isAdmin,
            },
        });
    } catch (error) {
        console.log("register error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email, password :", email, password); // Check email and password types

        if (!email || !password) {
            res.status(403);
            res.send(`required parameters missing, 
                    example request body:
                {
                    email: "abc email"
                    password: "abc password"
                } `);
            return;
        }

        req.body.email = req.body.email.toLowerCase();

        const user = await User.findOne({ where: { email: email } });
        console.log("login user :", user); // Check if user object is retrieved

        if (!user) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        // console.log("user.password type:", typeof user.password); // Check type of user.password
        // console.log("password type:", typeof password); // Check type of password

        // Check if user.password is a valid hash
        const comparePassword = await bcrypt.compare(password, user.password);
        console.log("comparePassword result:", comparePassword); // Check result of comparison

        if (!comparePassword) {
            return res.status(404).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            "Hassan_Nadeem",
            { expiresIn: "1h" }
        );
        console.log("login token :", token);
        res.status(201).json({
            message: "Login successful",
            token,
            user: {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.log("login error :", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    register,
    login,
};