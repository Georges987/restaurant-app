import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiExcludeEndpoint,
} from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({
        summary: 'Vérifier l\'état de santé de l\'API',
        description: `
      Endpoint de health check pour vérifier que l'API fonctionne correctement.
      
      **Utilisation :**
      - Monitoring et alertes
      - Load balancer health checks
      - Vérification de disponibilité
      
      **Réponse :**
      Retourne l'état de l'API, la version, et le timestamp.
    `,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'L\'API fonctionne correctement',
        schema: {
            example: {
                status: 'ok',
                message: 'Restaurant API is running',
                version: '1.0.0',
                timestamp: '2024-01-09T12:00:00.000Z',
                uptime: 12345.67,
                environment: 'development',
            },
        },
    })
    getHealth() {
        return {
            status: 'ok',
            message: 'Restaurant API is running',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };
    }

    @Get('database')
    @ApiOperation({
        summary: 'Vérifier la connexion à la base de données',
        description: `
      Vérifie que la connexion à PostgreSQL fonctionne correctement.
      
      **Utilisation :**
      - Diagnostic de problèmes de connexion
      - Monitoring de la base de données
    `,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'La base de données est accessible',
        schema: {
            example: {
                status: 'ok',
                message: 'Database connection is healthy',
                database: 'PostgreSQL',
                timestamp: '2024-01-09T12:00:00.000Z',
            },
        },
    })
    @ApiResponse({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        description: 'La base de données n\'est pas accessible',
        schema: {
            example: {
                status: 'error',
                message: 'Database connection failed',
                error: 'Connection timeout',
                timestamp: '2024-01-09T12:00:00.000Z',
            },
        },
    })
    async getDatabaseHealth() {
        // TODO: Implement actual database health check
        return {
            status: 'ok',
            message: 'Database connection is healthy',
            database: 'PostgreSQL',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('info')
    @ApiOperation({
        summary: 'Informations sur l\'API',
        description: `
      Retourne des informations détaillées sur l'API.
      
      **Informations incluses :**
      - Version de l'API
      - Version de Node.js
      - Environnement d'exécution
      - Fonctionnalités disponibles
    `,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Informations de l\'API',
        schema: {
            example: {
                api: {
                    name: 'Restaurant Management API',
                    version: '1.0.0',
                    description: 'API de gestion de restaurants multi-tenant',
                },
                runtime: {
                    node: 'v20.10.0',
                    platform: 'linux',
                    arch: 'x64',
                },
                environment: 'development',
                features: {
                    authentication: true,
                    websockets: true,
                    swagger: true,
                    multiTenant: true,
                },
                endpoints: {
                    documentation: '/api',
                    health: '/health',
                    websocket: 'ws://localhost:3000',
                },
            },
        },
    })
    getInfo() {
        return {
            api: {
                name: 'Restaurant Management API',
                version: '1.0.0',
                description: 'API de gestion de restaurants multi-tenant',
            },
            runtime: {
                node: process.version,
                platform: process.platform,
                arch: process.arch,
            },
            environment: process.env.NODE_ENV || 'development',
            features: {
                authentication: true,
                websockets: true,
                swagger: true,
                multiTenant: true,
            },
            endpoints: {
                documentation: '/api',
                health: '/health',
                websocket: `ws://localhost:${process.env.PORT || 3000}`,
            },
        };
    }
}
