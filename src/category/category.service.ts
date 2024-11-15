import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    let category = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });
    if (category) throw new BadRequestException('The category already exist');
    category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find({});
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });

    if (!category)
      throw new NotFoundException(`Category with id: ${id} does not exist`);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    await this.categoryRepository.update(id, updateCategoryDto);
    return { ...category, ...updateCategoryDto };
  }

  remove(id: number) {
    this.categoryRepository.delete({ id });
    return id;
  }
}
