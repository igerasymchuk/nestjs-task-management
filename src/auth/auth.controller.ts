import { Controller, Post, Body, ValidationPipe, Get, HttpException, HttpStatus, Ip, BadRequestException, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';

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
  getHello():void {
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
  signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Ip() ip: string): Promise<{ username: string, accessToken: string, refreshToken: string }> {
    return this.authService.signIn(authCredentialsDto, ip);
  }

  @Post('/refresh-token')
  refreshToken(
    @Body('refreshToken') refreshToken: string,
    @Ip() ip: string
  ): Promise<{ username: string, accessToken: string, refreshToken: string }> {
    return this.authService.refreshToken(refreshToken, ip);
  }

  @UseGuards(AuthGuard())
  @Post('/revoke-token')
  revokeToken(
    @Body('refreshToken') refreshToken: string,
    @Ip() ip: string,
    @GetUser() user: User
  ): Promise<void> {

    if (!refreshToken) throw new BadRequestException('Token is required');
    return this.authService.revokeToken(refreshToken, ip, user);
  }

  @UseGuards(AuthGuard())
  @Get('/remove-tokens')
  removeTokens(@GetUser() user: User): Promise<number> {
    return this.authService.removeTokens(user);
  }
}