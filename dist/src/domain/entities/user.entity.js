"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(props) {
        this.props = props;
    }
    static create(input) {
        const displayName = input.displayName.trim();
        if (displayName.length < 2) {
            throw new Error('El nombre debe tener al menos 2 caracteres.');
        }
        if (!input.passwordHash && !input.googleId) {
            throw new Error('Un usuario necesita contraseña o una cuenta de Google vinculada.');
        }
        return new User({
            id: input.id,
            email: input.email.toLowerCase().trim(),
            passwordHash: input.passwordHash,
            googleId: input.googleId,
            displayName,
            createdAt: input.now,
        });
    }
    static reconstitute(props) {
        return new User(props);
    }
    get id() { return this.props.id; }
    get email() { return this.props.email; }
    get passwordHash() { return this.props.passwordHash; }
    get googleId() { return this.props.googleId; }
    get displayName() { return this.props.displayName; }
    get createdAt() { return this.props.createdAt; }
    linkGoogleAccount(googleId) {
        this.props.googleId = googleId;
    }
}
exports.User = User;
