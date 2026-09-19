export interface UserProps {
    id: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    displayName: string;
    createdAt: Date;
}
export declare class User {
    private props;
    private constructor();
    static create(input: {
        id: string;
        email: string;
        passwordHash?: string;
        googleId?: string;
        displayName: string;
        now: Date;
    }): User;
    static reconstitute(props: UserProps): User;
    get id(): string;
    get email(): string;
    get passwordHash(): string | undefined;
    get googleId(): string | undefined;
    get displayName(): string;
    get createdAt(): Date;
    linkGoogleAccount(googleId: string): void;
}
