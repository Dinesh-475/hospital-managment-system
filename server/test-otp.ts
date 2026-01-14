
import { generateOTP } from './src/utils/otp';

console.log('Testing OTP Generation...');
try {
    const otp = generateOTP();
    console.log(`Generated OTP: ${otp}`);
    if (otp.length === 6 && /^\d+$/.test(otp)) {
        console.log('SUCCESS: OTP is valid 6-digit number');
    } else {
        console.error('FAILURE: OTP format invalid');
    }
} catch (error) {
    console.error('FAILURE: OTP generation threw error', error);
}
