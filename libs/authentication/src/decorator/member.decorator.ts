import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const CurrentMember = createParamDecorator((data: string, context: ExecutionContext) => {
    const { user } = context.switchToHttp().getRequest();
    return data ? user?.[data] : user;
});
