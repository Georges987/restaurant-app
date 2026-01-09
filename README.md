# 🍽️ Restaurant Management API

Application de gestion de restaurant multi-tenant permettant aux clients de commander des plats et aux équipes (cuisiniers, serveurs, super admin) de gérer les commandes avec un système de rôles personnalisables.

## 📋 Fonctionnalités

- ✅ **Multi-tenant** : Organisations avec plusieurs restaurants
- ✅ **Gestion des rôles** : Super Admin, Serveur, Cuisinier + rôles personnalisés
- ✅ **Gestion des menus** : Menus et plats avec catégories
- ✅ **Gestion des tables** : Statuts (disponible, occupée, réservée)
- ✅ **Gestion des commandes** : Workflow complet (pending → preparing → ready → served → paid)
- ✅ **Paiements** : Cash (Mobile Money et Carte à venir)
- ✅ **Statistiques** : Ventes, revenus, plats populaires
- ✅ **Temps réel** : Notifications WebSocket pour les commandes
- ✅ **API REST** : Documentation Swagger complète

## 🛠️ Stack Technique

- **Backend** : NestJS (Node.js/TypeScript)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentification** : JWT + Passport
- **Validation** : class-validator
- **Documentation** : Swagger/OpenAPI
- **Temps réel** : Socket.io

## 📦 Installation

### Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- pnpm (recommandé) ou npm

### Étapes

1. **Cloner le projet**
```bash
git clone <repository-url>
cd restaurant
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditez `.env` et configurez votre base de données :
```env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRATION="7d"
PORT=3000
NODE_ENV="development"
```

4. **Créer la base de données PostgreSQL**
```bash
# Connectez-vous à PostgreSQL
psql -U postgres

# Créez la base de données
CREATE DATABASE restaurant_db;
```

5. **Générer le client Prisma**
```bash
pnpm prisma:generate
```

6. **Exécuter les migrations**
```bash
pnpm prisma:migrate
```

7. **Peupler la base de données (optionnel)**
```bash
pnpm prisma:seed
```

Cela créera :
- 1 organisation
- 1 restaurant
- 3 rôles (Super Admin, Serveur, Cuisinier)
- 3 utilisateurs (un par rôle)
- 4 tables
- 1 menu avec 6 plats

## 🚀 Démarrage

### Mode développement
```bash
pnpm start:dev
```

L'application sera accessible sur :
- **API** : http://localhost:3000
- **Swagger** : http://localhost:3000/api
- **Prisma Studio** : `pnpm prisma:studio`

### Mode production
```bash
pnpm build
pnpm start:prod
```

## 🔐 Authentification

### Utilisateurs de test (après seed)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Super Admin | admin@legourmet.bj | password123 |
| Serveur | server@legourmet.bj | password123 |
| Cuisinier | cook@legourmet.bj | password123 |

### Connexion

```bash
POST /auth/login
{
  "email": "admin@legourmet.bj",
  "password": "password123"
}
```

Réponse :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@legourmet.bj",
    "firstName": "Admin",
    "lastName": "User",
    "role": {
      "name": "Super Admin",
      "permissions": { ... }
    }
  }
}
```

Utilisez le token dans les requêtes suivantes :
```
Authorization: Bearer <access_token>
```

## 📚 Structure du Projet

```
src/
├── common/              # Guards, decorators, interceptors
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── decorators/
│       ├── roles.decorator.ts
│       └── current-user.decorator.ts
├── prisma/              # Module Prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── modules/             # Modules métier (à venir)
│   ├── auth/
│   ├── organization/
│   ├── restaurant/
│   ├── user/
│   ├── role/
│   ├── table/
│   ├── menu/
│   ├── dish/
│   ├── order/
│   ├── payment/
│   └── statistics/
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma        # Schéma de base de données
├── seed.ts              # Données de test
└── migrations/          # Migrations
```

## 🗄️ Schéma de Base de Données

### Entités principales

- **Organization** : Organisation (peut avoir plusieurs restaurants)
- **Restaurant** : Restaurant (appartient à une organisation)
- **User** : Utilisateur (employé d'un restaurant)
- **Role** : Rôle avec permissions personnalisables
- **Table** : Table du restaurant
- **Menu** : Menu du restaurant
- **Dish** : Plat dans un menu
- **Order** : Commande
- **OrderItem** : Article de commande
- **Payment** : Paiement

### Relations

```
Organization (1) ──→ (N) Restaurant
Restaurant (1) ──→ (N) User
Restaurant (1) ──→ (N) Role
Restaurant (1) ──→ (N) Table
Restaurant (1) ──→ (N) Menu
Menu (1) ──→ (N) Dish
Table (1) ──→ (N) Order
Order (1) ──→ (N) OrderItem
Order (1) ──→ (1) Payment
```

## 🔒 Système de Permissions (RBAC)

Les permissions sont stockées en JSON dans la table `Role` :

```json
{
  "orders": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false
  },
  "menu": {
    "create": false,
    "read": true,
    "update": false,
    "delete": false
  },
  "statistics": {
    "read": false
  }
}
```

### Utilisation dans le code

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('orders.create', 'orders.read')
@Post()
createOrder(@CurrentUser() user: User) {
  // ...
}
```

## 📝 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `pnpm start:dev` | Démarrer en mode développement |
| `pnpm build` | Compiler le projet |
| `pnpm start:prod` | Démarrer en mode production |
| `pnpm prisma:generate` | Générer le client Prisma |
| `pnpm prisma:migrate` | Exécuter les migrations |
| `pnpm prisma:studio` | Ouvrir Prisma Studio |
| `pnpm prisma:seed` | Peupler la base de données |
| `pnpm db:setup` | Migrer + Seed |
| `pnpm test` | Exécuter les tests |
| `pnpm lint` | Linter le code |

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests e2e
pnpm test:e2e

# Couverture
pnpm test:cov
```

## 📖 Documentation API

Une fois l'application démarrée, accédez à la documentation Swagger :

**http://localhost:3000/api**

Vous y trouverez :
- Tous les endpoints disponibles
- Schémas des requêtes/réponses
- Possibilité de tester les endpoints directement

## 🚧 Roadmap

### Phase actuelle : Infrastructure ✅
- [x] Configuration Prisma
- [x] Schéma de base de données
- [x] Guards et décorateurs
- [x] Configuration Swagger

### Prochaines étapes

#### Phase 3 : Organisation & Restaurant
- [ ] Module Organization (CRUD)
- [ ] Module Restaurant (CRUD)

#### Phase 4 : User & Role
- [ ] Module Auth (Login, Register)
- [ ] Module User (CRUD)
- [ ] Module Role (CRUD + permissions)

#### Phase 5 : Menu & Dishes
- [ ] Module Menu (CRUD)
- [ ] Module Dish (CRUD)

#### Phase 6 : Tables
- [ ] Module Table (CRUD + statuts)

#### Phase 7 : Orders
- [ ] Module Order (CRUD + workflow)
- [ ] WebSocket pour notifications temps réel

#### Phase 8 : Payments
- [ ] Module Payment (Cash)
- [ ] Intégration Mobile Money (futur)

#### Phase 9 : Statistics
- [ ] Dashboard statistiques
- [ ] Rapports de ventes

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

UNLICENSED - Projet privé

## 👥 Auteurs

- Votre équipe

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub.

---

**Bon développement ! 🚀**
