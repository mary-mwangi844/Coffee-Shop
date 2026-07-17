import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
    }>;
    login(body: {
        identifier: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            phone: string;
        };
    }>;
    me(req: {
        user: {
            userId: number;
        };
    }): Promise<{
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phone: string;
    }>;
}
