import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const ActiveUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        const newUser = request.user
        newUser.organizationId = request.headers.organizationid
        return newUser;
});