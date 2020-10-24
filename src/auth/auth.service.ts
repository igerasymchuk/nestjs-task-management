import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import crypto from 'crypto';
import { RefreshTokenRepository } from './refresh-token.repository';
import { User } from './user.entity';
import { UserRole } from './userRole.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        private refreshTokenRepository: RefreshTokenRepository,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        console.log('signUp')
        await this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto,
        ip: string): Promise<{ username: string, accessToken: string, refreshToken: string }> {
        console.log('signIn')
        const user = await this.userRepository.validateUserPassword(authCredentialsDto);
        const username = user.username;

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        const refreshToken = await this.generateRefreshToken(username, ip);

        return { username, accessToken, refreshToken };
    }

    async refreshToken(token: string, ip: string): Promise<{ username: string, accessToken: string, refreshToken: string }> {
        console.log('refreshToken')
        const refreshToken = await this.refreshTokenRepository.getRefreshToken(token);

        if(!refreshToken || !refreshToken.isActive) {
            throw new UnauthorizedException('Invalid credentials');
        }
        //const user = await this.userRepository.getUserByName(refreshToken.username);
        const username = refreshToken.username;

        const newRefreshToken = await this.generateRefreshToken(username, ip);
        refreshToken.revoked = new Date();
        refreshToken.revokedByIp = ip;
        refreshToken.replacedByToken = newRefreshToken;

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);

        await this.refreshTokenRepository.revokeRefreshToken(refreshToken);

        return { username, accessToken, refreshToken: newRefreshToken };
    }

    async generateRefreshToken(username: string, ip: string): Promise<string> {
        const newRefreshToken = this.randomTokenString();
        const refreshToken = await this.refreshTokenRepository.createRefreshToken(username, newRefreshToken, ip);
        return refreshToken;
    }
    
    randomTokenString(): string {
        return require('crypto').randomBytes(40).toString('hex');
        //return crypto.randomBytes(40).toString('hex');
    }

    async revokeToken(token: string, ip: string, user: User): Promise<void> {
        console.log('revokeToken')
        const refreshToken = await this.refreshTokenRepository.getRefreshToken(token);
        if (!refreshToken) throw new BadRequestException();

        // users can revoke their own tokens and admins can revoke any tokens
        //if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
        if (refreshToken.username !== user.username && user.role !== UserRole.admin) {
            console.log('Incorrect token owner');
            throw new UnauthorizedException('Unauthorized');
        }

        refreshToken.revoked = new Date();
        refreshToken.revokedByIp = ip;
        await this.refreshTokenRepository.revokeRefreshToken(refreshToken);
    }

    
    async removeTokens(user: User): Promise<number> {
        console.log('revokeToken')

        if (user.role !== UserRole.admin) {
            console.log('Incorrect token owner', user);
            throw new UnauthorizedException('Unauthorized');
        }

        return await this.refreshTokenRepository.removeTokens();
    }
}
