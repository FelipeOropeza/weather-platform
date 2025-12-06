import { Injectable, ConflictException, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private config: ConfigService
  ) {}

  async onModuleInit() {
    // Seed default admin if not exists
    const email = this.config.get<string>('DEFAULT_ADMIN_EMAIL');
    const pass = this.config.get<string>('DEFAULT_ADMIN_PASSWORD');
    const name = this.config.get<string>('DEFAULT_ADMIN_NAME') || 'Admin';

    if (!email || !pass) return;

    const exists = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!exists) {
      const hashed = await bcrypt.hash(pass, 10);
      await this.userModel.create({ name, email: email.toLowerCase(), password: hashed, isAdmin: true });
      // optional: log
      // console.log(`[seed] default admin created: ${email}`);
    }
  }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.userModel.findOne({ email: createUserDto.email.toLowerCase() }).exec();
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(createUserDto.password, 10);
    const created = new this.userModel({ ...createUserDto, email: createUserDto.email.toLowerCase(), password: hashed });
    return created.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    const u = await this.userModel.findById(id).select('-password').exec();
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updated = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).select('-password').exec();
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async remove(id: string) {
    const removed = await this.userModel.findByIdAndDelete(id).exec();
    if (!removed) throw new NotFoundException('User not found');
    return { deleted: true };
  }
}
