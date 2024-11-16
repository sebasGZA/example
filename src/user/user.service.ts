import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
    return this.userRepository.save({
      ...createDto,
      email,
      password: passwordHash,
    });
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} ${JSON.stringify(updateUserDto)} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
