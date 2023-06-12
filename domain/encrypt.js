import bcrypt from 'bcryptjs';

export default async function generatePassword(password) {
    try {
        const salt = await bcrypt.genSalt(12);
        const encryptedPassword = await bcrypt.hash(password, salt);
        return encryptedPassword;
    } catch (error) {
        console.log(error);
    }
}