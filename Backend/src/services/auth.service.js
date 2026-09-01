import { User, Pharmacy } from '../models/index.js';
import ApiError from '../utils/ApiError.js';
import { signToken } from '../utils/token.js';

export async function register({ name, email, password, phone, role = 'patient', pharmacyId }) {
  if (await User.findOne({ email })) throw ApiError.conflict('Email already registered');

  if (role === 'pharmacist') {
    if (!pharmacyId) throw ApiError.badRequest('pharmacyId is required for pharmacists');
    if (!(await Pharmacy.findById(pharmacyId))) throw ApiError.notFound('Pharmacy not found');
  }

  const user = new User({
    name,
    email,
    phone,
    role,
    pharmacy: role === 'pharmacist' ? pharmacyId : undefined
  });
  await user.setPassword(password);
  await user.save();

  return { token: signToken(user), user };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyPassword(password))) {
    throw ApiError.unauthorized('Incorrect email or password');
  }
  return { token: signToken(user), user };
}

export default { register, login };
