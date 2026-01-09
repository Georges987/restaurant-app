import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredPermissions) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role || !user.role.permissions) {
            return false;
        }

        // Check if user has required permissions
        return this.hasPermissions(user.role.permissions, requiredPermissions);
    }

    private hasPermissions(
        userPermissions: any,
        requiredPermissions: string[],
    ): boolean {
        // requiredPermissions format: ['orders.create', 'orders.read']
        return requiredPermissions.every((permission) => {
            const [resource, action] = permission.split('.');
            return (
                userPermissions[resource] && userPermissions[resource][action] === true
            );
        });
    }
}
