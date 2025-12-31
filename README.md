#  StoreApp - Sistema de Pedidos Full-Stack By Alfredo Hermoso

Sistema integral de comercio electrónico de alto rendimiento desarrollado con **Symfony 7** (Backend) y **React 18 + Vite + TypeScript** (Frontend). El proyecto destaca por su arquitectura desacoplada, validación de stock atómica y una experiencia de usuario moderna.

---

##  Descripción del Proyecto

StoreApp es una plataforma diseñada para gestionar el flujo completo de una compra online. Implementa un **Catálogo Dinámico** que se comunica en tiempo real con una API REST para validar existencias, un **Sistema de Carrito** persistente y un **Módulo de Órdenes** para el seguimiento de pedidos.

### Componentes Clave:
* **Backend:** Symfony 7 con arquitectura basada en Entidades (Doctrine ORM).
* **Frontend:** React con Context API para la gestión del estado global y Tailwind CSS para el estilizado.
* **Base de Datos:** MySQL 8.0 para la persistencia de productos y pedidos.
* **Contenerización:** Configuración completa con Docker y Docker Compose.

---

##  Características Principales

* **Autenticación Simulada:** Manejo de roles (ADMIN y CLIENTE) mediante estados locales.
* **Gestión de Stock Inteligente:** El catálogo descuenta automáticamente las unidades en el carrito del stock disponible antes de permitir nuevas adiciones.
* **Buscador con Debounce:** Optimización de peticiones al backend mediante filtrado por Nombre o SKU.
* **Diseño UI/UX Premium:** Interfaz con bordes redondeados (`2.5rem`), tipografías `font-black` y feedback visual mediante Loaders de Lucide-React.
* **API Documentada:** Especificación OpenAPI 3.0 incluida.

---

##  Despliegue con Docker (Recomendado)

Esta es la forma más rápida de levantar el proyecto con todas sus dependencias.

### Requisitos:
* Docker y Docker Compose instalados.

### Pasos para iniciar:

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/alfjose19895/gproducts-AH.git
    ```

2.  **Levantar los contenedores:**
    ```bash
    docker-compose up -d --build
    ```

3.  **Configurar la Base de Datos (solo la primera vez):**
    ```bash
    docker-compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
    ```

### Acceso a las aplicaciones:
* **Frontend:** `http://localhost:3000`
* **Backend API:** `http://localhost:80`
* **Base de Datos:** `localhost:8080`
* **El proyecto en browser compila** en: http://localhost:3000/login
---

##  Levantamiento Manual (Sin Docker)

### Backend (Symfony)
1. `cd backend && composer install`
2. Configurar `.env`: `DATABASE_URL="mysql://root:password@127.0.0.1:3306/store_db"`
3. `php bin/console doctrine:database:create`
4. `php bin/console doctrine:migrations:migrate`
5. `symfony serve -d`

### Frontend (React)
1. `cd frontend && npm install`
2. `npm run dev`

---

##  Credenciales de Acceso (Simuladas)

| Rol | Email | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@tienda.com` | `admin123` | Gestión de stock y creación de productos. |
| **Cliente** | `cliente@tienda.com` | `cliente123` | Consulta de catálogo y compras. |

---

##  Estructura del Repositorio

```text
├── backend/                # Proyecto Symfony 7
│   ├── src/Entity/         # Modelos (Product, Order, OrderItem)
│   ├── src/Controller/     # Endpoints de la API
│   └── migrations/         # Control de versiones de la DB
├── frontend/               # Proyecto React + TypeScript
│   ├── src/context/        # Lógica del Carrito (CartContext)
│   ├── src/pages/          # Módulos (Catalog, Checkout, Orders)
│   └── src/components/     # Layouts y UI reusable
├── docker-compose.yml      # Configuración de orquestación
├── openapi.yaml            # Documentación técnica de la API
└── README.md               # Documentación general


## Definicion del Modelado de Datos

El sistema utiliza un modelo de datos relacional diseñado para garantizar 
la integridad referencial y la consistencia del inventario. 
Se divide en tres entidades principales:

1. Entidad: Product (Catálogo e Inventario)
Es el núcleo del sistema. Almacena la información técnica y comercial 
de los artículos.

Campos clave: price (para cálculos monetarios) y 
stock (campo crítico que el frontend consulta para habilitar/deshabilitar ventas).

2. Entidad: Order (Cabecera de Pedido)
Representa la transacción final. Almacena datos globales de la compra.

Relación: Se vincula con un customer_id (simulado en este proyecto) 
para rastrear quién realizó la compra.

3. Entidad: OrderItem (Detalle del Pedido)
Es una tabla de ruptura que resuelve la relación de muchos a 
muchos entre Productos y Órdenes.

  * Función: Guarda una "fotografía" del precio y la cantidad 
  en el momento de la compra, permitiendo que si el precio del 
  producto cambia en el catálogo, el historial del pedido se mantenga intacto.


erDiagram
    PRODUCT ||--o{ ORDER_ITEM : "se incluye en"
    ORDER ||--|{ ORDER_ITEM : "contiene"
    
    PRODUCT {
        int id PK
        string name "Nombre del producto"
        string sku "Código único de inventario"
        decimal price "Precio unitario"
        int stock "Existencias disponibles"
    }

    ORDER {
        int id PK
        int customer_id "ID del cliente (1: Cliente, 2: Admin)"
        decimal total "Suma total de la orden"
        datetime created_at "Fecha de creación"
    }

    ORDER_ITEM {
        int id PK
        int order_id FK "Referencia a la orden"
        int product_id FK "Referencia al producto"
        int quantity "Cantidad comprada"
        decimal price "Precio al momento de la venta"
    }

Reglas de Negocio en el MER:
Relación 1:N (Order -> OrderItem): Una orden puede tener múltiples productos, 
pero cada línea de detalle pertenece a una única orden.

Relación 1:N (Product -> OrderItem): Un producto puede aparecer en muchas 
órdenes diferentes.

Integridad de Stock: Cada vez que se inserta un registro en ORDER_ITEM, 
el sistema (Backend) debe restar la quantity del stock en la tabla PRODUCT.

**Diccionario de Datos Técnico**

Tabla,Campo,Tipo,Descripción
Product,sku,VARCHAR(50),Índice único para búsquedas rápidas.
Product,price,"DECIMAL(10,2)",Precisión decimal para evitar errores de redondeo.
Order,total,"DECIMAL(10,2)",Calculado como la sumatoria de los items.
OrderItem,product_id,INT (FK),Restricción ON DELETE SET NULL para 
mantener el historial si un producto se borra.