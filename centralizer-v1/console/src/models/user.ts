export interface User{
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    verificationString: string;
    passwordResetCode: string;
    isLocked: boolean;
    passwordHash: string;
}