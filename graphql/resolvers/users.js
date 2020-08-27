const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const config = require('../../config');

module.exports = {
    Mutation: {
        async register (_, 
                {
                    registerInput: { username, email, password, confirmPassword }
                }
            ) 
        {
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

            const token = jwt.sign({
                _id: result._id,
                email: result.email,
                username: result.username
            }, config.SECRET, { expiresIn: '1h'});

            return {
                ...result._doc,
                id: result._id,
                token
            }
        }
    }
}