import bcrypt from 'bcrypt';

const hashedPassword = (password) => {
    const saltRounds = 10;
    const hash = bcrypt.hash(password, saltRounds);
    return hash;
}

export default hashedPassword;