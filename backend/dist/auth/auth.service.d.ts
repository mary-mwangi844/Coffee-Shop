import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
type RegisterInput = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
};
type LoginInput = {
    identifier: string;
    password: string;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(input: RegisterInput): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
    }>;
    login(input: LoginInput): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
    }>;
    me(userId: number): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    }>;
    private issueToken;
    private toPublic;
}
export {};
