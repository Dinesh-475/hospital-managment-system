import { Request, Response, NextFunction } from 'express';
import { 
  generateTokens, 
  verifyRefreshToken 
} from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Staff } from '../models/Staff';
import { Patient } from '../models/Patient';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ success: false, message: 'Token required' });

        const payload: any = verifyRefreshToken(token);
        const user = await User.findById(payload.userId);

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        const tokens = generateTokens({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion
        } as any);

        res.status(200).json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });

    } catch (error) {
        next(error);
    }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password || !firstName || !lastName) {
             return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
             return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
             email,
             passwordHash,
             firstName,
             lastName,
             role: 'PATIENT',
             isVerified: false,
             isActive: true
        });

        // Create patient profile
        await Patient.create({
            userId: newUser._id,
            dateOfBirth: new Date()
        });

        const tokens = generateTokens({
            id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role,
            tokenVersion: newUser.tokenVersion
        } as any);

        res.status(201).json({
             success: true,
             accessToken: tokens.accessToken,
             refreshToken: tokens.refreshToken,
             user: {
                 id: newUser._id,
                 email: newUser.email,
                 name: `${newUser.firstName} ${newUser.lastName}`,
                 role: newUser.role
             }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier, password } = req.body; // identifier can be email or employeeId

        if (!identifier || !password) {
             return res.status(400).json({ success: false, message: 'ID/Email and password required' });
        }

        let user;

        // Check if identifier is an email
        if (identifier.includes('@')) {
            user = await User.findOne({ email: identifier });
        } else {
            // Assume it's an employeeId, look up Staff first
            const staff = await Staff.findOne({ employeeId: identifier }).populate('userId');
            if (staff && staff.userId) {
                user = staff.userId as any;
            }
        }

        if (!user || !user.passwordHash) {
             return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
             return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const tokens = generateTokens({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            tokenVersion: user.tokenVersion
        } as any);

        res.status(200).json({
             success: true,
             accessToken: tokens.accessToken,
             refreshToken: tokens.refreshToken,
             user: {
                 id: user._id,
                 email: user.email,
                 name: `${user.firstName} ${user.lastName}`,
                 role: user.role
             }
        });
    } catch (error) {
        next(error);
    }
};
