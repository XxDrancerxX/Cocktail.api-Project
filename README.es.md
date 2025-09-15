### **Nota importante para la base de datos y los datos dentro de ella**

Cada entorno de Github Codespace tendrá **su propia base de datos**, por lo que si estás trabajando con más personas, cada uno tendrá una base de datos diferente y diferentes registros dentro de ella. Estos datos **se perderán**, así que no pases demasiado tiempo creando registros manualmente para pruebas, en su lugar, puedes automatizar la adición de registros a tu base de datos editando el archivo `commands.py` dentro de la carpeta `/src/api`. Edita la línea 32 de la función `insert_test_data` para insertar los datos según tu modelo (usa la función `insert_test_users` anterior como ejemplo). Luego, todo lo que necesitas hacer es ejecutar `pipenv run insert-test-data`.

## Cómo llenar FRONTEND_URL y VITE_BACKEND_URL

Para configurar correctamente tus variables de entorno, sigue estos pasos:

1. Abre tu archivo `.env`.
2. Para `FRONTEND_URL`, escribe la URL completa donde se ejecutará tu frontend (por ejemplo, en Codespaces o localmente):

   ```env
   FRONTEND_URL=https://tu-url-del-frontend.com
   ```

3. Para `VITE_BACKEND_URL`, escribe la URL completa donde se ejecutará tu backend:

   ```env
   VITE_BACKEND_URL=https://tu-url-del-backend.com
   ```

**Reglas importantes:**

- NO uses comillas para las URLs (escribe: VITE_BACKEND_URL=https://..., no VITE_BACKEND_URL="https://...").
- NO agregues espacios antes ni después del signo `=`.
- NO agregues una barra `/` al final de la URL (escribe: https://tu-url-del-backend.com, no https://tu-url-del-backend.com/).
- Solo la variable `JWT_SECRET_KEY` debe llevar comillas, y debe escribirse sin espacios (por ejemplo: JWT_SECRET_KEY="tu_secreto").

**Ejemplo:**

```env
FRONTEND_URL=https://curly-happiness-jjrx779pq5wwhpp7q-3000.app.github.dev
VITE_BACKEND_URL=https://curly-happiness-jjrx779pq5wwhpp7q-3001.app.github.dev
JWT_SECRET_KEY="tu_secreto"
```

## Configuración de la clave API de Google Places
Para usar las funciones de Google Places en este proyecto, necesitas tu propia clave API de Google:

1. Ve a la [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto (o selecciona uno existente).
3. Habilita la "Places API" para tu proyecto.
4. Crea una clave API y restríngela según sea necesario.
5. Copia tu clave API.
6. Crea un archivo `.env` en la raíz del proyecto (puedes copiar `.env.example` como plantilla).
7. Pega tu clave API en el archivo `.env` así:

   ```env
   GOOGLE_API_KEY=tu_clave_api_de_google_aquí
   ```

**Nunca compartas tu clave API real públicamente.**

---

## ⚠️ Importante: Haz públicos los puertos en Codespaces

Si ejecutas este proyecto en GitHub Codespaces, asegúrate de establecer los puertos expuestos (como el backend y el frontend) como **públicos**. De lo contrario, podrías tener errores de conexión o no poder acceder a tu aplicación desde el navegador.

Para hacerlo:

1. Haz clic en la pestaña "Ports" en la parte inferior de la ventana de tu Codespace.
2. Busca el puerto donde se está ejecutando tu app (por ejemplo, 3000, 5000, 8080).
3. Haz clic en el ícono de candado y selecciona "Public".

Esto asegura que tú (y cualquier persona con el enlace) puedan acceder a la aplicación en ejecución.



