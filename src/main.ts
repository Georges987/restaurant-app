import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('🍽️ Restaurant Management API')
    .setDescription(
      `
# Restaurant Management System API

Une API complète pour la gestion de restaurants multi-tenant avec système de commandes, menus, et gestion d'équipe.

## 🎯 Fonctionnalités Principales

### 🏢 Multi-tenant
- Gestion d'organisations avec plusieurs restaurants
- Isolation complète des données par restaurant

### 👥 Gestion des Utilisateurs
- Système de rôles personnalisables (RBAC)
- Rôles par défaut : Super Admin, Serveur, Cuisinier
- Permissions granulaires par ressource

### 📋 Gestion des Menus
- Création de menus multiples
- Gestion des plats avec catégories
- Prix et disponibilité en temps réel

### 🪑 Gestion des Tables
- Statuts : Disponible, Occupée, Réservée
- Capacité et numérotation

### 📦 Gestion des Commandes
- Workflow complet : Pending → Preparing → Ready → Served → Paid
- Notifications en temps réel (WebSocket)
- Historique des commandes

### 💰 Paiements
- Paiement en cash (Mobile Money à venir)
- Suivi des transactions
- Réconciliation automatique

### 📊 Statistiques
- Revenus par période
- Plats les plus vendus
- Nombre de commandes
- Rapports personnalisables

## 🔐 Authentification

Cette API utilise JWT (JSON Web Tokens) pour l'authentification.

### Obtenir un token

1. Appelez \`POST /auth/login\` avec vos identifiants
2. Récupérez le \`access_token\` dans la réponse
3. Utilisez ce token dans le header \`Authorization: Bearer <token>\` pour les requêtes suivantes

### Exemple de connexion

\`\`\`json
POST /auth/login
{
  "email": "admin@legourmet.bj",
  "password": "password123"
}
\`\`\`

### Utilisateurs de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | admin@legourmet.bj | password123 |
| Serveur | server@legourmet.bj | password123 |
| Cuisinier | cook@legourmet.bj | password123 |

## 📝 Conventions

### Format des dates
Toutes les dates sont au format ISO 8601 : \`2024-01-09T12:00:00Z\`

### Pagination
Les endpoints de liste supportent la pagination :
- \`page\` : Numéro de page (défaut: 1)
- \`limit\` : Nombre d'éléments par page (défaut: 10, max: 100)

### Codes de statut HTTP
- \`200\` : Succès
- \`201\` : Créé avec succès
- \`400\` : Erreur de validation
- \`401\` : Non authentifié
- \`403\` : Non autorisé (permissions insuffisantes)
- \`404\` : Ressource non trouvée
- \`500\` : Erreur serveur

## 🏷️ Tags

Les endpoints sont organisés par catégories :
- **Auth** : Authentification et autorisation
- **Organizations** : Gestion des organisations
- **Restaurants** : Gestion des restaurants
- **Users** : Gestion des utilisateurs
- **Roles** : Gestion des rôles et permissions
- **Tables** : Gestion des tables
- **Menus** : Gestion des menus
- **Dishes** : Gestion des plats
- **Orders** : Gestion des commandes
- **Payments** : Gestion des paiements
- **Statistics** : Statistiques et rapports

## 🚀 Démarrage Rapide

1. Créez une organisation
2. Créez un restaurant dans cette organisation
3. Créez des rôles (ou utilisez les rôles par défaut)
4. Créez des utilisateurs
5. Créez un menu avec des plats
6. Créez des tables
7. Commencez à prendre des commandes !

## 📚 Ressources Utiles

- [Documentation complète](https://github.com/votre-repo)
- [Guide de démarrage](https://github.com/votre-repo/wiki)
- [Exemples de code](https://github.com/votre-repo/examples)
      `,
    )
    .setVersion('1.0.0')
    .setContact(
      'Support Technique',
      'https://github.com/votre-repo',
      'support@restaurant-api.com',
    )
    .setLicense('UNLICENSED', '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT (obtenu via /auth/login)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentification et gestion des sessions')
    .addTag('Organizations', 'Gestion des organisations multi-tenant')
    .addTag('Restaurants', 'Gestion des restaurants')
    .addTag('Users', 'Gestion des utilisateurs et employés')
    .addTag('Roles', 'Gestion des rôles et permissions (RBAC)')
    .addTag('Tables', 'Gestion des tables du restaurant')
    .addTag('Menus', 'Gestion des menus')
    .addTag('Dishes', 'Gestion des plats et articles')
    .addTag('Orders', 'Gestion des commandes clients')
    .addTag('Payments', 'Gestion des paiements')
    .addTag('Statistics', 'Statistiques et rapports analytiques')
    .addServer('http://localhost:3000', 'Serveur de développement')
    .addServer('https://api.restaurant.com', 'Serveur de production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Restaurant API - Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();


