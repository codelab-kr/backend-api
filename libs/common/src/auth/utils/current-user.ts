import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestByContext } from './get.request.by.context';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export const CurrentUser = createParamDecorator(
  async (_data: unknown, context: ExecutionContext) => {
    const req = getRequestByContext(context);
    const userInfo = req?.user;
    if (!userInfo) {
      return null;
    }
    return { ...userInfo, ...(await addToken(userInfo)) };
  },
);

const addToken = async (userInfo: any) => {
  try {
    const jwtService = await import('@nestjs/jwt');
    const { JwtService } = jwtService;
    const jwtModuleOptions = {
      secret: configService.get('SECRET'),
      signOptions: { expiresIn: configService.get('EXPIRESIN') },
    };
    const jwtServiceInstance = new JwtService(jwtModuleOptions);
    const { id } = userInfo;
    return {
      access_token: jwtServiceInstance.sign({ id }),
    };
  } catch (error) {
    console.error(error);
  }
};
