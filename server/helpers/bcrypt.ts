import bcrypt from 'bcrypt';
const SALT = 10;

/**
 * Hash the password
 * @param password the password to be hashed
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT);
};

/**
 * Compare password
 * @param password password entered
 * @param hashedPassword hashed password
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
