import { randomBytes } from 'crypto';

export const generateReservationCode = () => `RX-${randomBytes(3).toString('hex').toUpperCase()}`;

export default generateReservationCode;
