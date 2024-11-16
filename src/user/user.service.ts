import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create({ email, password, ...createDto }: CreateUserDto) {
    let user = await this.userRepository.findOneBy({ email });
    if (user)
      throw new BadRequestException(
        `The user with email ${email} already exist`,
      );
    user = this.userRepository.create({ email, ...createDto });
    const passwordHash = await argon2.hash(password);
    const userDb = await this.userRepository.save({
      ...createDto,
      email,
      password: passwordHash,
    });
    delete userDb.password;
    return userDb;
  }

  findAll() {
    return this.userRepository.find({
      select: ['email', 'id', 'isActive', 'name'],
    });
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('The user is not found');
    return user;
  }

  async updatePassword(email: string, password: string) {
    const userDb = await this.userRepository.findOneBy({ email });
    if (!userDb) throw new NotFoundException('User does not exist');
    try {
      const passwordHash = await argon2.hash(password);
      await this.userRepository.update({ email }, { password: passwordHash });
      return { email };
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message);
    }
  }

  async remove(id: number) {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
