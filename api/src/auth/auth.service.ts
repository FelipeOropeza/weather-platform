import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const valid = await bcrypt.compare(pass, user.password);
    if (!valid) return null;

    const { password, ...safeUser } = user.toObject ? user.toObject() : user;

    return safeUser;
  }

  async login(user: any) {
    const safeUser = user.toObject ? user.toObject() : user;

    const payload = {
      sub: safeUser._id || safeUser.id,
      email: safeUser.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: safeUser._id || safeUser.id,
        email: safeUser.email,
        name: safeUser.name ?? null,
      },
    };
  }

  async signInWithCredentials(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.login(user);
  }
}
