# Sistema de Exposicion

> Repositorio del proyecto **Sistema de Exposicion**, creado como material de estudio del programa **TÉCNICO EN PROGRAMACION DE SOFTWARE** del SENA.
>
> Esta es la guía general: explica lo mínimo que necesitas saber sobre un proyecto de programación (Base de Datos, Backend, Frontend, cómo se comunican y qué es un ORM). Si buscas los detalles técnicos de cada parte, entra a los README de cada carpeta.

## Tabla de contenidos

1. [Estructura del proyecto](#1-estructura-del-proyecto)
2. [¿Qué es una Base de Datos?](#2-qué-es-una-base-de-datos)
3. [¿Qué es un Backend (API)?](#3-qué-es-un-backend-api)
4. [¿Qué es un Frontend?](#4-qué-es-un-frontend)
5. [¿Cómo se comunican los tres?](#5-cómo-se-comunican-los-tres)
6. [¿Qué es un ORM y por qué se usa?](#6-qué-es-un-orm-y-por-qué-se-usa)

## 1. Estructura del proyecto

Un proyecto de programación moderno se divide en partes con responsabilidades claras. Este repositorio tiene dos carpetas principales:

| Carpeta | Qué contiene | Documentación |
|---|---|---|
| `backend/` | La **API** (servidor) y la lógica que habla con la Base de Datos | [backend/README.md](backend/README.md) |
| `frontend/` | La **interfaz** que ve y usa la persona en el navegador | [frontend/README.md](frontend/README.md) |

Aquí solo vemos el mapa general. Cada README interno explica su propia carpeta en detalle: instalación, comandos, estructura interna y solución de problemas.

## 2. ¿Qué es una Base de Datos?

Una Base de Datos es un sistema que **guarda la información de forma persistente**: los datos siguen ahí aunque apaguemos la computadora. En este proyecto se usa **PostgreSQL**, un motor de Base de Datos relacional, donde la información se organiza en **tablas** (por ejemplo, una tabla de categorías y otra de productos), relacionadas entre sí.

La Base de Datos no habla directamente con el navegador: quien se comunica con ella es el Backend.

## 3. ¿Qué es un Backend (API)?

El **Backend** es el programa que corre en el servidor (tu computadora o una máquina remota). Su parte visible se llama **API** (*Application Programming Interface*): un conjunto de **endpoints** (rutas como `GET /api/v1/products`) que reciben peticiones y devuelven respuestas, casi siempre en formato JSON.

El Backend es quien:

- **Valida** que lo que llega sea correcto.
- **Aplica la lógica** del negocio (por ejemplo, qué productos se pueden listar).
- **Lee y escribe** en la Base de Datos.

En este proyecto el Backend está hecho con **NestJS** y expone su API bajo el prefijo `/api/v1`. Detalles en [backend/README.md](backend/README.md).

## 4. ¿Qué es un Frontend?

El **Frontend** es la parte que la persona **ve y manipula**: páginas, botones, formularios, listas. Corre en el navegador y su trabajo es mostrar la información y capturar la intención del usuario (hacer clic, enviar un formulario) para convertirla en peticiones a la API.

En este proyecto el Frontend está hecho con **React** (con Vite). Detalles en [frontend/README.md](frontend/README.md).

## 5. ¿Cómo se comunican los tres?

La comunicación sigue siempre el mismo camino, del usuario a los datos:

```
Frontend (navegador)
   │  1. Petición HTTP con datos en JSON
   ▼
Backend / API  (/api/v1/...)
   │  2. Valida y aplica la lógica
   ▼
ORM  (TypeORM)
   │  3. Traduce a SQL
   ▼
Base de Datos  (PostgreSQL)
   │  4. Devuelve los resultados
   ▼
Backend convierte la respuesta a JSON
   │  5. Respuesta HTTP
   ▼
Frontend muestra los datos en pantalla
```

En resumen: el Frontend habla con la API por **HTTP** usando **JSON**, la API habla con la Base de Datos a través del **ORM**, y los resultados regresan por el mismo camino inverso.

Referencia de los endpoints disponibles: la API publica su documentación en **Swagger**, servida en `http://localhost:5555/api/v1/docs` cuando el backend está corriendo.

## 6. ¿Qué es un ORM y por qué se usa?

Un **ORM** (*Object-Relational Mapping*, mapeo objeto-relacional) es una herramienta que **traduce entre el código y la Base de Datos**: las filas de una tabla se representan como objetos del programa, y las operaciones que haces sobre esos objetos se convierten en sentencias SQL.

¿Para qué sirve? Para **no escribir SQL a mano** en cada consulta y para trabajar con datos ya validados y con nombres consistentes en todo el backend. También facilita cambios de esquema y reduce errores de tipeo en las consultas.

- **En este proyecto:** el Backend usa **TypeORM** con PostgreSQL.
- **Otra opción popular del ecosistema:** **Prisma**, que cumple el mismo rol en proyectos Node.js con otros frameworks.

---

¿Listo para ver el detalle? Comienza por [backend/README.md](backend/README.md) o [frontend/README.md](frontend/README.md).
