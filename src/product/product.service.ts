import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(createProductDto: CreateProductDto) {
    let product = await this.productRepository.findOneBy({
      name: createProductDto.name,
    });
    if (product) throw new BadRequestException('The product already exist');
    product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({});
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} does not exist`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    await this.productRepository.update(id, updateProductDto);
    return { ...product, ...updateProductDto };
  }

  remove(id: number) {
    this.productRepository.delete({ id });
    return id;
  }
}
