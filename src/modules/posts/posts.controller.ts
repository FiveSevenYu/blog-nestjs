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
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { CreatePostDto } from './post.dto';
import { DemoService } from './providers/demo/demo.service';
import { DemoFilter } from 'src/core/filters/demo.filter';
import { DemoAuthGuard } from 'src/core/guards/demo-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';
import { LoggingInterceptor } from 'src/core/interceptors/logging.interceptor';
import { TransformInterceptor } from 'src/core/interceptors/transform.interceptor';
import { ErrorsInterceptor } from 'src/core/interceptors/errors.interceptor';
import { User } from 'src/core/decorators/user.decorator';
import { DemoPipe } from 'src/core/pipes/demo.pipe';

@Controller('posts')
// @UseFilters(DemoFilter)
// @UseGuards(DemoAuthGuard)
// @UseInterceptors(LoggingInterceptor)
export class PostsController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  // @UseInterceptors(TransformInterceptor)
  @UseInterceptors(ErrorsInterceptor)
  index(@Headers('authorization') headers) {
    throw new ForbiddenException()
    // return this.demoService.findAll();
  }

  @Get(':id')
  show(@Param('id', ParseIntPipe, DemoPipe) id) {
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
  store(@Body()  post: CreatePostDto, @User('demo') user) {
    console.log(user)
    // throw new HttpException('没有权限', HttpStatus.FORBIDDEN)
    // throw new ForbiddenException('没有权限 ！')
    this.demoService.create(post);
  }
}
