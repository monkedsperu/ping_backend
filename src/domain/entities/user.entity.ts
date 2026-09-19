export interface UserProps {
  id: string;
  email: string;
  passwordHash?: string; // nulo para cuentas creadas por Google
  googleId?: string;
  displayName: string;
  createdAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(input: {
    id: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    displayName: string;
    now: Date;
  }): User {
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

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get passwordHash() { return this.props.passwordHash; }
  get googleId() { return this.props.googleId; }
  get displayName() { return this.props.displayName; }
  get createdAt() { return this.props.createdAt; }

  linkGoogleAccount(googleId: string): void {
    this.props.googleId = googleId;
  }

  renameTo(newDisplayName: string): void {
    const trimmed = newDisplayName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      throw new Error('El nombre debe tener entre 2 y 30 caracteres.');
    }
    this.props.displayName = trimmed;
  }
}
