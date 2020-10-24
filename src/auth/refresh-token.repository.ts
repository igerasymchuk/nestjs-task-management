import { Repository, EntityRepository, IsNull } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> {

    async getRefreshToken(
        token: string,
    ): Promise<RefreshToken> {
        //const refreshToken = await this.findOne({ where: { token: token } });
        return await this.findOne({ where: { token: token } });
    }

    async createRefreshToken(username: string, token: string, ip: string): Promise<string> {
        const refreshToken = new RefreshToken();
        refreshToken.created = new Date();
        refreshToken.username = username;
        refreshToken.token = token;
        // create a refresh token that expires in 7 days
        refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        refreshToken.createdByIp = ip;
        // refreshToken.revoked = token; //date
        // refreshToken.revokedByIp = token;
        // refreshToken.replacedByToken = token;

        await refreshToken.save();

        return refreshToken.token;
    }

    async revokeRefreshToken(token: RefreshToken): Promise<RefreshToken> {
        const refreshToken = await this.getRefreshToken(token.token);
        refreshToken.revoked = token.revoked;
        refreshToken.revokedByIp = token.revokedByIp;
        refreshToken.replacedByToken = token.replacedByToken;
        await refreshToken.save();

        return refreshToken;
    }

    async removeTokens(): Promise<number> {
        const res =  await this.createQueryBuilder("token")
            .where("token.revoked IS NOT NULL OR token.expires < NOW()").getManyAndCount();
        await this.remove(res[0]);
        return res[1];
    }
}