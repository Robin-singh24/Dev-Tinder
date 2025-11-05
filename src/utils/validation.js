import validator from 'validator';

const validateUserSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Please enter a valid First Name or Last Name');
    } else if (!validator.isEmail(email)) {
        throw new Error('Please enter a valid Email');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter a strong Password');
    }
}

export {
    validateUserSignUpData
};