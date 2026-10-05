export class AuthService {
  constructor(userRepository) { this.userRepository = userRepository; }

  async findOrCreateGoogleUser(profile) {
    let user = await this.userRepository.findByEmail(profile.email);
    if (!user) {
      user = {
        googleId: profile.uid, name: profile.name, email: profile.email, avatar: profile.picture
      };
      return this.userRepository.create(user);
    }
    return this.userRepository.update(user.id, { googleId: profile.uid, name: profile.name, avatar: profile.picture });
  }

  findUserByEmail(email) { return this.userRepository.findByEmail(email); }
}
