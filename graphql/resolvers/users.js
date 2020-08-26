const User = require('../../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../../config');

module.exports = {
    Mutation: {
        async register (_, 
                {
                    registerInput: { username, email, password, confirmPassword }
                }, 
                context, 
                info
            ) 
        {
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