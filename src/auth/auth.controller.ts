import { Controller, Post, Body, ValidationPipe, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';

export class Cat {
  @ApiProperty()
  id: number;
}

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Get()
  getHello() {
    //throw new HttpException('Forbidden2', HttpStatus.FORBIDDEN);
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN);
    //return { message: 'Hello World!' };
  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  //@ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiCreatedResponse({
    description: 'The user has been successfully authenticated.',
    type: String
})
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  // @Post('/test')
  // @UseGuards(AuthGuard())
  // test(@GetUser() user: User) {
  //   console.log(user);
  // }

}