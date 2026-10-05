import type { LoginFormData } from "@/validations/auth.schema";

const MOCK_DELAY = 1000;
const VALID_EMAIL = "admin@email.com";
const VALID_PASS = "Admin1234@!";

export const authService = {
    async login(data: LoginFormData): Promise<{ token: string; user: { name: string; email: string } }> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (data.email === VALID_EMAIL && data.password === VALID_PASS) {
                    resolve({
                        token: "mock_jwt_token_12345",
                        user: { name: "Super Admin", email: VALID_EMAIL },
                    });
                } else {
                    reject(new Error("Invalid email or password"));
                }
            }, MOCK_DELAY);
        });
    },

    async requestOtp(email: string): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(true), MOCK_DELAY);
        });
    },

    async verifyOtp(otp: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (otp === "123456") resolve(true);
                else reject(new Error("Invalid OTP code"));
            }, MOCK_DELAY);
        });
    }
};