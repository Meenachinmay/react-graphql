const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../utils/Validators');

const config = require('../../config');

function generateToken (user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        username: user.username
    }, config.SECRET, { expiresIn: '1h'});
}

module.exports = {
    Mutation: {
        async login (_, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors' , { errors });
            }
            
            // getting a user from mongodb
            const user = await User.findOne({ username });

            if (!user) {
                errors.general = "User not found";
                throw new UserInputError('User not found', { errors });
            }

            // password match
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                errors.general = "Wrong credentials.";
                throw new UserInputError('Wrong credentials.', { errors });
            }

            // sending a token back
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
            
        },
        async register (_, 
                {
                    registerInput: { username, email, password, confirmPassword }
                }
            ) 
        {
            // req data validation
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

            if (!valid) {
                throw new UserInputError('Errors' , { errors });
            }

            // validation for unique username
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }
            
            // validation for unique email address
            const existedEmail = await User.findOne({ email });
            if (existedEmail) {
                throw new UserInputError('Email is taken',  {
                    errors: {
                        email: 'This email is already taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);
          
            const newUser = new User ({
                email,
                password,
                username,
                createdAt: new Date().toISOString()
            });

            const result = await newUser.save();

            const token = generateToken(result);

            return {
                ...result._doc,
                id: result._id,
                token
            }
        }
    }
}