# 📖 API Reference - Restaurant Management System

## 🌐 Base URL

- **Développement** : `http://localhost:3000`
- **Production** : `https://api.restaurant.com`

## 🔐 Authentification

Toutes les requêtes (sauf `/health` et `/auth/login`) nécessitent un token JWT.

### Obtenir un Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@legourmet.bj",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
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

### Utiliser le Token

Ajoutez le token dans le header `Authorization` de toutes vos requêtes :

```http
GET /restaurants
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 Endpoints Disponibles

### 🏥 Health Check

#### GET /health
Vérifier l'état de santé de l'API.

**Authentification** : Non requise

**Réponse :**
```json
{
  "status": "ok",
  "message": "Restaurant API is running",
  "version": "1.0.0",
  "timestamp": "2024-01-09T12:00:00.000Z",
  "uptime": 12345.67,
  "environment": "development"
}
```

#### GET /health/database
Vérifier la connexion à la base de données.

**Authentification** : Non requise

**Réponse :**
```json
{
  "status": "ok",
  "message": "Database connection is healthy",
  "database": "PostgreSQL",
  "timestamp": "2024-01-09T12:00:00.000Z"
}
```

#### GET /health/info
Informations détaillées sur l'API.

**Authentification** : Non requise

**Réponse :**
```json
{
  "api": {
    "name": "Restaurant Management API",
    "version": "1.0.0",
    "description": "API de gestion de restaurants multi-tenant"
  },
  "runtime": {
    "node": "v20.10.0",
    "platform": "linux",
    "arch": "x64"
  },
  "environment": "development",
  "features": {
    "authentication": true,
    "websockets": true,
    "swagger": true,
    "multiTenant": true
  },
  "endpoints": {
    "documentation": "/api",
    "health": "/health",
    "websocket": "ws://localhost:3000"
  }
}
```

---

## 🔑 Authentification (Auth)

### POST /auth/login
Connexion utilisateur.

**Body :**
```json
{
  "email": "admin@legourmet.bj",
  "password": "password123"
}
```

**Réponse (200) :**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@legourmet.bj",
    "firstName": "Admin",
    "lastName": "User",
    "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
    "role": {
      "id": "123e4567-e89b-12d3-a456-426614174002",
      "name": "Super Admin",
      "permissions": {
        "orders": { "create": true, "read": true, "update": true, "delete": true },
        "menu": { "create": true, "read": true, "update": true, "delete": true }
      }
    }
  }
}
```

**Erreurs :**
- `401` : Identifiants invalides
- `400` : Données manquantes

### GET /auth/me
Récupérer le profil de l'utilisateur connecté.

**Headers :**
```
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "admin@legourmet.bj",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "+229 12 34 56 78",
  "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
  "role": {
    "name": "Super Admin",
    "permissions": { ... }
  }
}
```

---

## 🏢 Organizations

### POST /organizations
Créer une nouvelle organisation.

**Permissions** : `organizations.create`

**Body :**
```json
{
  "name": "Restaurant Group",
  "description": "Groupe de restaurants"
}
```

**Réponse (201) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Restaurant Group",
  "description": "Groupe de restaurants",
  "createdAt": "2024-01-09T12:00:00.000Z",
  "updatedAt": "2024-01-09T12:00:00.000Z"
}
```

### GET /organizations
Lister toutes les organisations.

**Permissions** : `organizations.read`

**Query Parameters :**
- `page` (optional) : Numéro de page (défaut: 1)
- `limit` (optional) : Éléments par page (défaut: 10)

**Réponse (200) :**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Restaurant Group",
      "description": "Groupe de restaurants",
      "createdAt": "2024-01-09T12:00:00.000Z",
      "updatedAt": "2024-01-09T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### GET /organizations/:id
Récupérer une organisation par ID.

**Permissions** : `organizations.read`

**Réponse (200) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Restaurant Group",
  "description": "Groupe de restaurants",
  "restaurants": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174001",
      "name": "Le Gourmet"
    }
  ],
  "createdAt": "2024-01-09T12:00:00.000Z",
  "updatedAt": "2024-01-09T12:00:00.000Z"
}
```

### PATCH /organizations/:id
Mettre à jour une organisation.

**Permissions** : `organizations.update`

**Body :**
```json
{
  "name": "New Name",
  "description": "New description"
}
```

### DELETE /organizations/:id
Supprimer une organisation.

**Permissions** : `organizations.delete`

**Réponse (200) :**
```json
{
  "message": "Organization deleted successfully"
}
```

---

## 🍽️ Restaurants

### POST /restaurants
Créer un nouveau restaurant.

**Permissions** : `restaurants.create`

**Body :**
```json
{
  "organizationId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Le Gourmet",
  "address": "123 Rue de la Paix, Cotonou",
  "phone": "+229 12 34 56 78",
  "email": "contact@legourmet.bj",
  "settings": {
    "currency": "XOF",
    "timezone": "Africa/Porto-Novo"
  }
}
```

**Réponse (201) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174001",
  "organizationId": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Le Gourmet",
  "address": "123 Rue de la Paix, Cotonou",
  "phone": "+229 12 34 56 78",
  "email": "contact@legourmet.bj",
  "settings": {
    "currency": "XOF",
    "timezone": "Africa/Porto-Novo"
  },
  "createdAt": "2024-01-09T12:00:00.000Z",
  "updatedAt": "2024-01-09T12:00:00.000Z"
}
```

### GET /restaurants
Lister tous les restaurants.

**Permissions** : `restaurants.read`

**Query Parameters :**
- `organizationId` (optional) : Filtrer par organisation
- `page` (optional) : Numéro de page
- `limit` (optional) : Éléments par page

---

## 👥 Users

### POST /users
Créer un nouvel utilisateur.

**Permissions** : `users.create`

**Body :**
```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
  "roleId": "123e4567-e89b-12d3-a456-426614174002",
  "email": "server@legourmet.bj",
  "password": "password123",
  "firstName": "Server",
  "lastName": "User",
  "phone": "+229 12 34 56 79"
}
```

### GET /users
Lister tous les utilisateurs.

**Permissions** : `users.read`

**Query Parameters :**
- `restaurantId` (optional) : Filtrer par restaurant
- `roleId` (optional) : Filtrer par rôle
- `isActive` (optional) : Filtrer par statut

---

## 🎭 Roles

### POST /roles
Créer un nouveau rôle.

**Permissions** : `roles.create`

**Body :**
```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Manager",
  "description": "Restaurant manager",
  "permissions": {
    "orders": { "create": true, "read": true, "update": true, "delete": false },
    "menu": { "create": true, "read": true, "update": true, "delete": false },
    "users": { "create": false, "read": true, "update": false, "delete": false },
    "statistics": { "read": true }
  }
}
```

---

## 🪑 Tables

### POST /tables
Créer une nouvelle table.

**Permissions** : `tables.create`

**Body :**
```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
  "number": "1",
  "capacity": 4,
  "status": "AVAILABLE"
}
```

### PATCH /tables/:id/status
Changer le statut d'une table.

**Permissions** : `tables.update`

**Body :**
```json
{
  "status": "OCCUPIED"
}
```

**Statuts possibles :**
- `AVAILABLE` : Disponible
- `OCCUPIED` : Occupée
- `RESERVED` : Réservée

---

## 📋 Menus

### POST /menus
Créer un nouveau menu.

**Permissions** : `menu.create`

**Body :**
```json
{
  "restaurantId": "123e4567-e89b-12d3-a456-426614174001",
  "name": "Menu Principal",
  "description": "Notre sélection de plats",
  "isActive": true
}
```

---

## 🍲 Dishes

### POST /dishes
Créer un nouveau plat.

**Permissions** : `menu.create`

**Body :**
```json
{
  "menuId": "123e4567-e89b-12d3-a456-426614174003",
  "name": "Poulet Braisé",
  "description": "Poulet grillé avec sauce pimentée",
  "price": 2500,
  "category": "Plats Principaux",
  "imageUrl": "https://example.com/poulet.jpg",
  "isAvailable": true
}
```

### GET /dishes
Lister tous les plats.

**Permissions** : `menu.read`

**Query Parameters :**
- `menuId` (optional) : Filtrer par menu
- `category` (optional) : Filtrer par catégorie
- `isAvailable` (optional) : Filtrer par disponibilité

---

## 📦 Orders

### POST /orders
Créer une nouvelle commande.

**Permissions** : `orders.create`

**Body :**
```json
{
  "tableId": "123e4567-e89b-12d3-a456-426614174004",
  "customerName": "John Doe",
  "items": [
    {
      "dishId": "123e4567-e89b-12d3-a456-426614174005",
      "quantity": 2,
      "notes": "Sans piment"
    },
    {
      "dishId": "123e4567-e89b-12d3-a456-426614174006",
      "quantity": 1
    }
  ],
  "notes": "Commande urgente"
}
```

**Réponse (201) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174007",
  "tableId": "123e4567-e89b-12d3-a456-426614174004",
  "customerName": "John Doe",
  "status": "PENDING",
  "totalAmount": 5500,
  "notes": "Commande urgente",
  "items": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174008",
      "dishId": "123e4567-e89b-12d3-a456-426614174005",
      "dishName": "Poulet Braisé",
      "quantity": 2,
      "unitPrice": 2500,
      "subtotal": 5000,
      "notes": "Sans piment"
    },
    {
      "id": "123e4567-e89b-12d3-a456-426614174009",
      "dishId": "123e4567-e89b-12d3-a456-426614174006",
      "dishName": "Jus de Bissap",
      "quantity": 1,
      "unitPrice": 500,
      "subtotal": 500
    }
  ],
  "createdAt": "2024-01-09T12:00:00.000Z",
  "updatedAt": "2024-01-09T12:00:00.000Z"
}
```

### PATCH /orders/:id/status
Changer le statut d'une commande.

**Permissions** : `orders.update`

**Body :**
```json
{
  "status": "PREPARING"
}
```

**Workflow des statuts :**
1. `PENDING` : En attente
2. `PREPARING` : En préparation (cuisinier)
3. `READY` : Prête (cuisinier)
4. `SERVED` : Servie (serveur)
5. `PAID` : Payée (après paiement)
6. `CANCELLED` : Annulée

### GET /orders
Lister toutes les commandes.

**Permissions** : `orders.read`

**Query Parameters :**
- `status` (optional) : Filtrer par statut
- `tableId` (optional) : Filtrer par table
- `startDate` (optional) : Date de début
- `endDate` (optional) : Date de fin

---

## 💰 Payments

### POST /payments
Enregistrer un paiement.

**Permissions** : `payments.create`

**Body :**
```json
{
  "orderId": "123e4567-e89b-12d3-a456-426614174007",
  "method": "CASH",
  "amount": 5500
}
```

**Réponse (201) :**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174010",
  "orderId": "123e4567-e89b-12d3-a456-426614174007",
  "method": "CASH",
  "amount": 5500,
  "status": "COMPLETED",
  "paidAt": "2024-01-09T12:00:00.000Z",
  "createdAt": "2024-01-09T12:00:00.000Z"
}
```

**Méthodes de paiement :**
- `CASH` : Espèces
- `MOBILE_MONEY` : Mobile Money (à venir)
- `CARD` : Carte bancaire (à venir)

---

## 📊 Statistics

### GET /statistics/sales
Total des ventes.

**Permissions** : `statistics.read`

**Query Parameters :**
- `startDate` (optional) : Date de début
- `endDate` (optional) : Date de fin
- `restaurantId` (optional) : Filtrer par restaurant

**Réponse (200) :**
```json
{
  "totalSales": 125000,
  "totalOrders": 50,
  "averageOrderValue": 2500,
  "period": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-09T23:59:59.000Z"
  }
}
```

### GET /statistics/popular-dishes
Plats les plus vendus.

**Permissions** : `statistics.read`

**Réponse (200) :**
```json
{
  "dishes": [
    {
      "dishId": "123e4567-e89b-12d3-a456-426614174005",
      "dishName": "Poulet Braisé",
      "totalOrders": 45,
      "totalQuantity": 67,
      "totalRevenue": 167500
    },
    {
      "dishId": "123e4567-e89b-12d3-a456-426614174011",
      "dishName": "Poisson Grillé",
      "totalOrders": 32,
      "totalQuantity": 38,
      "totalRevenue": 114000
    }
  ]
}
```

### GET /statistics/dashboard
Vue d'ensemble du dashboard.

**Permissions** : `statistics.read`

**Réponse (200) :**
```json
{
  "today": {
    "sales": 15000,
    "orders": 12,
    "averageOrderValue": 1250
  },
  "thisWeek": {
    "sales": 85000,
    "orders": 68,
    "averageOrderValue": 1250
  },
  "thisMonth": {
    "sales": 350000,
    "orders": 280,
    "averageOrderValue": 1250
  },
  "topDishes": [
    {
      "name": "Poulet Braisé",
      "orders": 45
    }
  ],
  "recentOrders": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174007",
      "table": "Table 3",
      "amount": 5500,
      "status": "SERVED",
      "createdAt": "2024-01-09T11:30:00.000Z"
    }
  ]
}
```

---

## 🔌 WebSocket Events

### Connexion

```javascript
const socket = io('ws://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Événements

#### order:created
Émis quand une nouvelle commande est créée.

```json
{
  "event": "order:created",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174007",
    "tableId": "123e4567-e89b-12d3-a456-426614174004",
    "status": "PENDING",
    "totalAmount": 5500,
    "items": [...]
  }
}
```

#### order:updated
Émis quand une commande est mise à jour.

```json
{
  "event": "order:updated",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174007",
    "status": "PREPARING",
    "updatedAt": "2024-01-09T12:05:00.000Z"
  }
}
```

#### order:status-changed
Émis quand le statut d'une commande change.

```json
{
  "event": "order:status-changed",
  "data": {
    "orderId": "123e4567-e89b-12d3-a456-426614174007",
    "oldStatus": "PENDING",
    "newStatus": "PREPARING",
    "changedBy": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

---

## 🚨 Codes d'Erreur

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Token manquant ou invalide |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error | Erreur serveur |

### Format des Erreurs

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```

---

## 📚 Ressources Utiles

- **Documentation Swagger** : http://localhost:3000/api
- **Health Check** : http://localhost:3000/health
- **Prisma Studio** : `pnpm prisma:studio`

---

**Version** : 1.0.0  
**Dernière mise à jour** : 2024-01-09
