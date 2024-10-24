import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const DataOrigin = createParamDecorator(
    (data: unknown, ctx: ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest();
        return request.dataOrigin;
});