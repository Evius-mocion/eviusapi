import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { validateNavigator } from '../utils/validations.util';
import { NavigatorEnum } from 'src/constants/constants';

@Injectable()
export class originGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Obtener la solicitud desde el contexto de ejecución
    const request: Request = context.switchToHttp().getRequest();

    // Obtener la IP del cliente
    const ip = request.ip

    // Obtener el User Agent (navegador)
    const userAgent = request.headers['user-agent'];

    // Obtener la plataforma del User-Agent (se puede inferir del encabezado)
    const navigator = validateNavigator(userAgent)
    const plataform = navigator === NavigatorEnum.postman ? 'Dev tool' :request.headers['sec-ch-ua-platform'] || 'Desconocido';

    // Otros headers útiles que puedes obtener
    const origin = request.headers['origin'] || 'Desconocido';

    // Información que puedes loguear o guardar
    console.log('IP:', ip);
    console.log('userAgent:', userAgent);
    console.log('Plataforma:', plataform);
    console.log('Origin:', origin);
    console.log('navegator:', navigator );

    request["dataOrigin"] = {
        ip,
        plataform,
        origin,
        navigator
    }
    // Retorna true para permitir el acceso al controlador
    return true;
  }
}
