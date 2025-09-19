# ☁️ Gestor de Tareas CLI - Migración a MongoDB

Este proyecto es una refactorización de un gestor de tareas de línea de comandos (CLI) en Node.js para migrar su persistencia de datos de un archivo JSON a una base de datos **MongoDB**.

## 🚀 Requisitos

Asegúrate de tener instalado:

* **Node.js** (versión 18 o superior)
* **MongoDB** (corriendo en `localhost:27017`)

## 📋 Configuración de MongoDB

El proyecto se conecta a la base de datos `gestorTareas` y utiliza la colección `tareas`. Asegúrate de que tu instancia local de MongoDB esté activa antes de ejecutar la aplicación.

## 🛠️ Instalación

1.  Clona este repositorio o descarga los archivos.
2.  Navega al directorio del proyecto en tu terminal.
3.  Instala las dependencias necesarias con npm:

    ```bash
    npm install
    ```

## 📂 Estructura del Código

El proyecto está organizado de manera modular para separar las responsabilidades, lo que facilita el mantenimiento y la escalabilidad.

```bash
/gestor-tareas
|-- /controllers
|   `-- tareasController.js  # Lógica de negocio para las operaciones CRUD con MongoDB.
|-- /db
|   `-- mongo.js             # Módulo para manejar la conexión y desconexión de la base de datos.
|-- /helpers
|   `-- menu.js              # Maneja el menú interactivo para el usuario.
|-- /models
|   `-- tarea.js             # Define la estructura del documento de tarea para MongoDB.
|-- package.json             # Dependencias y configuración del proyecto.
`-- index.js                 # Punto de entrada principal de la aplicación.
```

## 📂 Estructura del Código 

 * Juan Pablo Cifuentes