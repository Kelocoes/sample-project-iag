# Sistema de Gestión de Proyectos y Tareas Operativas

Aplicación completa de gestión de proyectos y tareas desarrollada con **React (Vite + Tailwind CSS)** en el frontend y **NestJS (TypeORM + SQLite)** en el backend.

---

## 🔑 Credenciales de Usuarios de Ejemplo (Jerarquía de 3 Usuarios)

Para probar la navegación, cambiar entre cuentas y manipular la jerarquía completa:

| Rol | Nombre | Correo Electrónico | Contraseña | Asignaciones Predeterminadas |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Carlos Ruiz | `admin@empresa.com` | `password123` | Administrador general de todas las organizaciones y proyectos. |
| **Manager** | Marta Gómez | `marta@empresa.com` | `password123` | Coordinadora de *Corporativo Servicios del Norte* y proyecto de eventos. |
| **Manager** | David Silva | `david@empresa.com` | `password123` | Encargado de *Alianzas Operativas del Sur* y campañas de clientes. |

> 💡 *Puedes alternar entre usuarios en cualquier momento desde el selector en la esquina superior derecha o volver al modal de login.*

---

## 🏢 Jerarquía de la Aplicación

- **Organización**: Entidad superior creada y administrada por el usuario `Admin`.
- **Proyecto**: Pertenece a una Organización y cuenta con un `Manager` asignado responsable de los presupuestos y tareas.
- **Tarea**: Pertenecen a un Proyecto y se asignan a miembros o managers.

---

## ⚡ Instrucciones para Ejecutar la Aplicación

### 1. Iniciar el Backend (NestJS API REST)
```bash
cd backend
npm install
npm run build
node dist/main.js
```
*El servidor backend se iniciará en `http://localhost:3000` con la base de datos SQLite pre-poblada.*

### 2. Iniciar el Frontend (React Vite + Tailwind)
```bash
cd frontend
npm install
npm run dev
```
*El servidor de desarrollo iniciará en `http://localhost:5173`.*

---

## 🚀 Características Clave Implementadas

1. **Tema Claro Elegante (Light Theme)**:
   - Paleta limpia en tonos `slate-50`, bordes sutiles y acentos azul/índigo.
2. **Jerarquía Organizacional Completa**:
   - Eliminación directa de Organizaciones y Proyectos sin modal de confirmación previa.
   - Posibilidad de crear nuevas Organizaciones y registrar nuevos Usuarios/Managers en proyectos.
3. **Tablero Kanban Interactivo e URL Routing**:
   - Drag & Drop nativo.
   - Cambio de URL a `/kanban/task/<id>` con IDs **numéricos secuenciales (`1`, `2`, `3`...)**.
4. **Detalle Ampliado del Proyecto**:
   - Abrir en nueva pestaña `/project/<id>` con presupuesto (`$`), control de horas y equipo.
