# 📚 Guide de Documentation Swagger

Ce guide explique comment documenter correctement les endpoints de l'API avec Swagger pour une documentation claire et complète.

## 🎯 Objectif

Chaque endpoint doit être documenté avec :
- Description claire et détaillée
- Exemples de requêtes et réponses
- Codes de statut HTTP possibles
- Schémas de validation
- Tags appropriés

## 📝 Structure d'un Module Documenté

### 1. DTOs (Data Transfer Objects)

Les DTOs doivent utiliser les décorateurs Swagger pour documenter chaque propriété.

#### Exemple : CreateDishDto

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateDishDto {
  @ApiProperty({
    description: 'Nom du plat',
    example: 'Poulet Braisé',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description détaillée du plat',
    example: 'Poulet grillé avec sauce pimentée et légumes frais',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Prix du plat en XOF',
    example: 2500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Catégorie du plat',
    example: 'Plats Principaux',
    enum: ['Entrées', 'Plats Principaux', 'Accompagnements', 'Desserts', 'Boissons'],
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'URL de l\'image du plat',
    example: 'https://example.com/images/poulet-braise.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Indique si le plat est disponible',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'ID du menu auquel appartient le plat',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsString()
  menuId: string;
}
```

### 2. Entités de Réponse

Les entités doivent également être documentées pour les réponses.

#### Exemple : DishEntity

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class DishEntity {
  @ApiProperty({
    description: 'Identifiant unique du plat',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Nom du plat',
    example: 'Poulet Braisé',
  })
  name: string;

  @ApiProperty({
    description: 'Description du plat',
    example: 'Poulet grillé avec sauce pimentée',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Prix en XOF',
    example: 2500,
    type: 'number',
  })
  price: number;

  @ApiProperty({
    description: 'Catégorie',
    example: 'Plats Principaux',
    nullable: true,
  })
  category: string | null;

  @ApiProperty({
    description: 'URL de l\'image',
    example: 'https://example.com/images/poulet-braise.jpg',
    nullable: true,
  })
  imageUrl: string | null;

  @ApiProperty({
    description: 'Disponibilité',
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: 'ID du menu',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  menuId: string;

  @ApiProperty({
    description: 'Date de création',
    example: '2024-01-09T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière modification',
    example: '2024-01-09T12:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}
```

### 3. Controller avec Documentation Complète

#### Exemple : DishController

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishEntity } from './entities/dish.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';

@ApiTags('Dishes')
@ApiBearerAuth('JWT-auth')
@ApiExtraModels(PaginatedResponseDto, DishEntity)
@Controller('dishes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @Roles('menu.create')
  @ApiOperation({
    summary: 'Créer un nouveau plat',
    description: `
      Crée un nouveau plat dans un menu existant.
      
      **Permissions requises :** \`menu.create\`
      
      **Validations :**
      - Le nom est obligatoire (2-100 caractères)
      - Le prix doit être >= 0
      - Le menuId doit exister
      
      **Exemple d'utilisation :**
      Utilisez cet endpoint pour ajouter de nouveaux plats à votre menu.
      Le plat sera automatiquement marqué comme disponible sauf indication contraire.
    `,
  })
  @ApiBody({
    type: CreateDishDto,
    description: 'Données du plat à créer',
    examples: {
      'Plat Principal': {
        value: {
          name: 'Poulet Braisé',
          description: 'Poulet grillé avec sauce pimentée',
          price: 2500,
          category: 'Plats Principaux',
          imageUrl: 'https://example.com/poulet.jpg',
          isAvailable: true,
          menuId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
      Boisson: {
        value: {
          name: 'Jus de Bissap',
          description: 'Jus de fleur d\'hibiscus frais',
          price: 500,
          category: 'Boissons',
          isAvailable: true,
          menuId: '123e4567-e89b-12d3-a456-426614174000',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Le plat a été créé avec succès',
    type: DishEntity,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données de validation invalides',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'price must be a positive number'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token JWT manquant ou invalide',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Permissions insuffisantes',
    schema: {
      example: {
        statusCode: 403,
        message: 'Forbidden resource',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Menu non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: 'Menu not found',
        error: 'Not Found',
      },
    },
  })
  create(@Body() createDishDto: CreateDishDto) {
    return this.dishService.create(createDishDto);
  }

  @Get()
  @Roles('menu.read')
  @ApiOperation({
    summary: 'Lister tous les plats',
    description: `
      Récupère la liste paginée de tous les plats.
      
      **Permissions requises :** \`menu.read\`
      
      **Filtres disponibles :**
      - Par menu (menuId)
      - Par catégorie (category)
      - Par disponibilité (isAvailable)
      
      **Pagination :**
      - page : Numéro de page (défaut: 1)
      - limit : Éléments par page (défaut: 10, max: 100)
    `,
  })
  @ApiQuery({
    name: 'menuId',
    required: false,
    description: 'Filtrer par ID de menu',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrer par catégorie',
    example: 'Plats Principaux',
  })
  @ApiQuery({
    name: 'isAvailable',
    required: false,
    description: 'Filtrer par disponibilité',
    type: Boolean,
    example: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des plats récupérée avec succès',
    schema: {
      example: {
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Poulet Braisé',
            description: 'Poulet grillé avec sauce pimentée',
            price: 2500,
            category: 'Plats Principaux',
            imageUrl: 'https://example.com/poulet.jpg',
            isAvailable: true,
            menuId: '123e4567-e89b-12d3-a456-426614174001',
            createdAt: '2024-01-09T12:00:00Z',
            updatedAt: '2024-01-09T12:00:00Z',
          },
        ],
        meta: {
          total: 25,
          page: 1,
          limit: 10,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  })
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('menuId') menuId?: string,
    @Query('category') category?: string,
    @Query('isAvailable') isAvailable?: boolean,
  ) {
    return this.dishService.findAll(paginationDto, {
      menuId,
      category,
      isAvailable,
    });
  }

  @Get(':id')
  @Roles('menu.read')
  @ApiOperation({
    summary: 'Récupérer un plat par son ID',
    description: `
      Récupère les détails complets d'un plat spécifique.
      
      **Permissions requises :** \`menu.read\`
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID unique du plat',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plat trouvé',
    type: DishEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plat non trouvé',
    schema: {
      example: {
        statusCode: 404,
        message: 'Dish not found',
        error: 'Not Found',
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.dishService.findOne(id);
  }

  @Patch(':id')
  @Roles('menu.update')
  @ApiOperation({
    summary: 'Mettre à jour un plat',
    description: `
      Met à jour les informations d'un plat existant.
      
      **Permissions requises :** \`menu.update\`
      
      Tous les champs sont optionnels. Seuls les champs fournis seront mis à jour.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID du plat à mettre à jour',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateDishDto,
    examples: {
      'Changement de prix': {
        value: {
          price: 3000,
        },
      },
      'Mise à jour complète': {
        value: {
          name: 'Poulet Braisé Spécial',
          description: 'Poulet grillé avec sauce pimentée et légumes du jour',
          price: 3500,
          isAvailable: true,
        },
      },
      'Marquer indisponible': {
        value: {
          isAvailable: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plat mis à jour avec succès',
    type: DishEntity,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plat non trouvé',
  })
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(id, updateDishDto);
  }

  @Delete(':id')
  @Roles('menu.delete')
  @ApiOperation({
    summary: 'Supprimer un plat',
    description: `
      Supprime définitivement un plat du menu.
      
      **Permissions requises :** \`menu.delete\`
      
      ⚠️ **Attention :** Cette action est irréversible.
      Si le plat est référencé dans des commandes existantes, la suppression échouera.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID du plat à supprimer',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plat supprimé avec succès',
    schema: {
      example: {
        message: 'Dish deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Plat non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Le plat ne peut pas être supprimé car il est référencé',
    schema: {
      example: {
        statusCode: 409,
        message: 'Cannot delete dish: referenced in existing orders',
        error: 'Conflict',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.dishService.remove(id);
  }
}
```

## 🎨 Bonnes Pratiques

### 1. Descriptions Claires

- Utilisez des descriptions détaillées et en français
- Expliquez le contexte et l'utilisation
- Mentionnez les permissions requises
- Indiquez les validations importantes

### 2. Exemples Réalistes

- Fournissez plusieurs exemples pour les cas d'usage courants
- Utilisez des données réalistes (pas de "foo", "bar")
- Montrez différents scénarios (succès, erreurs)

### 3. Codes de Statut HTTP

Documentez tous les codes de statut possibles :
- `200` : Succès (GET, PATCH, DELETE)
- `201` : Créé (POST)
- `400` : Validation échouée
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `409` : Conflit
- `500` : Erreur serveur

### 4. Tags et Organisation

- Utilisez des tags cohérents
- Groupez les endpoints par ressource
- Suivez une convention de nommage claire

### 5. Sécurité

- Ajoutez `@ApiBearerAuth('JWT-auth')` sur les endpoints protégés
- Documentez les permissions avec `@Roles()`
- Expliquez les contraintes de sécurité

## 📋 Checklist pour Chaque Endpoint

- [ ] `@ApiOperation()` avec summary et description détaillée
- [ ] `@ApiTags()` approprié
- [ ] `@ApiBearerAuth()` si protégé
- [ ] `@ApiBody()` avec exemples pour POST/PATCH
- [ ] `@ApiParam()` pour les paramètres de route
- [ ] `@ApiQuery()` pour les query parameters
- [ ] `@ApiResponse()` pour tous les codes de statut possibles
- [ ] Exemples de réponses pour succès et erreurs
- [ ] DTOs avec `@ApiProperty()` sur chaque champ

## 🚀 Résultat

Avec cette documentation complète :
- Les développeurs comprennent immédiatement comment utiliser l'API
- Les exemples permettent de tester rapidement
- Les erreurs possibles sont anticipées
- La maintenance est facilitée

## 📚 Ressources

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
