import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { validateNavigator } from '../utils/validations.util';
import { NavigatorEnum } from 'src/constants/constants';
import * as geoip from 'geoip-country'


@Injectable()
export class originGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Obtener la solicitud desde el contexto de ejecución
    const request: Request = context.switchToHttp().getRequest();

    // Obtener la IP del cliente
    const ip = request.socket.remoteAddress
    const geo = geoip.lookup(ip)
    // Obtener el User Agent (navegador)
    const userAgent = request.headers['user-agent'];

    // Obtener la plataforma del User-Agent (se puede inferir del encabezado)
    const navigator = validateNavigator(userAgent)
    const plataform = navigator === NavigatorEnum.postman ? 'Dev tool' :request.headers['sec-ch-ua-platform'] || 'Desconocido';

    // Otros headers útiles que puedes obtener
    const origin = request.headers['origin'] || 'Desconocido';



    request["dataOrigin"] = {
        ip,
        plataform,
        origin,
        navigator,
        country:  geo?.name || 'Desconocido'
    }
    // Retorna true para permitir el acceso al controlador
    return true;
  }
}
