import bcrypt from 'bcryptjs';

const addSalt = async (toSalt: String, seasoning: String) => {
  const extraSalty =
    seasoning.substr(0, 2) + seasoning.substr(seasoning.length - 2, 2);

  return bcrypt.hash(extraSalty + toSalt, process.env.PASS_SALT!);
};

export default addSalt;
