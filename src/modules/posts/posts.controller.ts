import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Body,
  HttpException,
  HttpStatus,
  ForbiddenException,
  UseFilters,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { DemoService } from './providers/demo/demo.service';
import { DemoFilter } from 'src/core/filters/demo.filter';
import { DemoAuthGuard } from 'src/core/guards/demo-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

@Controller('posts')
// @UseFilters(DemoFilter)
// @UseGuards(DemoAuthGuard)
export class PostsController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  index(@Headers('authorization') headers) {
    return this.demoService.findAll();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe) id) {
    console.log('id:', typeof id);

    return {
      title: `Post ${id}`,
    };
  }

  @Post()
  // @UseFilters(DemoFilter)
  @UsePipes(ValidationPipe)
  // @SetMetadata('roles', ['member'])
  @Roles('member')
  store(@Body() post: CreatePostDto) {
    // throw new HttpException('没有权限', HttpStatus.FORBIDDEN)
    // throw new ForbiddenException('没有权限 ！')
    this.demoService.create(post);
  }
}
