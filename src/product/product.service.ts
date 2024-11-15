import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
  ) {}

  async create({ categoryId, ...createProductDto }: CreateProductDto) {
    const category = await this.categoryService.findOne(categoryId);
    let product = await this.productRepository.findOneBy({
      name: createProductDto.name,
    });
    if (product) throw new BadRequestException('The product already exist');
    product = this.productRepository.create({ category, ...createProductDto });
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ loadRelationIds: true });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      loadRelationIds: true,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} does not exist`);
    return product;
  }

  async update(id: number, { categoryId, ...updateDto }: UpdateProductDto) {
    const category = categoryId
      ? await this.categoryService.findOne(categoryId)
      : undefined;
    const product = await this.findOne(id);
    await this.productRepository.update(id, { category, ...updateDto });
    return { ...product, ...updateDto, category };
  }

  remove(id: number) {
    this.productRepository.delete({ id });
    return id;
  }
}
