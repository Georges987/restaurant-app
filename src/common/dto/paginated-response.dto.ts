import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
    @ApiProperty({ description: 'Liste des éléments de la page courante' })
    data: T[];

    @ApiProperty({
        description: 'Métadonnées de pagination',
        example: {
            total: 100,
            page: 1,
            limit: 10,
            totalPages: 10,
            hasNextPage: true,
            hasPreviousPage: false,
        },
    })
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
