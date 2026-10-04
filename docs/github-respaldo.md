# GitHub: respaldo y acceso del proyecto

Registro verificado el 2026-10-04 (America/Los_Angeles).

## Identidad y ubicación

- Marca: Multisoluciones Web. La carpeta local conserva su nombre histórico `jscothserver`.
- Proyecto local: `C:\ProgramandoconClaude\Proyectos\enProceso\jscothserver`.
- Propietario de GitHub: Juan Torres, cuenta `multisolucioneslv`.
- Repositorio privado: https://github.com/multisolucioneslv/Multisoluciones-Web.
- Remoto `origin`, lectura y escritura: `git@github.com:multisolucioneslv/Multisoluciones-Web.git`.
- Rama: `main`, vinculada a `origin/main`.
- Primer push completado: 2026-10-04. Se subieron los nueve commits locales existentes, incluido el checkpoint inicial recuperado.
- Versión verificada en ese primer push: `8f39ee596599255527e5c1826a91de46e46550b5`. HEAD local y `refs/heads/main` remoto coincidieron.
- Esta documentación se añade después del primer push y tendrá su propio commit.

## Clave de acceso SSH

La clave pertenece a esta computadora, no al VPS; no se reutilizan las claves de Hostinger.

| Dato | Valor |
| --- | --- |
| Tipo | ED25519, autenticación |
| Título en GitHub | PC Multicards - Multisoluciones Web |
| Comentario | multisolucioneslv-github |
| Clave privada local | `C:\Users\Multicards\.ssh\github_multisolucioneslv` |
| Clave pública local | `C:\Users\Multicards\.ssh\github_multisolucioneslv.pub` |
| Huella pública | `SHA256:dEgApyuoiZnuI1zh6lmn4s0/HlJ10iw0FAlSGevQGI4` |
| Gestión en GitHub | https://github.com/settings/keys |

La clave privada está protegida por una frase que introduce el usuario. No se registra aquí, en Git, ni en el chat. El usuario cargó la clave en el agente SSH con `ssh-add`; la autenticación devolvió `Hi multisolucioneslv! You've successfully authenticated, but GitHub does not provide shell access.`

La clave permite operaciones Git según los permisos de esa cuenta; no queda restringida solo a este repositorio. Conservarla fuera del proyecto. En otra computadora es preferible crear una clave propia y autorizarla, en vez de copiar esta privada. Si se compromete, revocarla en GitHub y generar otra.

## Configuración local de Git

En `.git/config` (no versionado) quedó configurado `core.sshCommand`, solo para este proyecto:

```text
C:/Windows/System32/OpenSSH/ssh.exe -i C:/Users/Multicards/.ssh/github_multisolucioneslv -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=yes
```

Esto usa OpenSSH de Windows y la clave indicada, sin cambiar la configuración global ni las conexiones del VPS. `BatchMode=yes` evita pedir la frase en operaciones automatizadas: la clave debe estar previamente cargada en el agente. `StrictHostKeyChecking=yes` exige conocer y verificar el servidor; no desactivar esta comprobación para resolver errores.

Para cargar la clave desde PowerShell de Windows:

```powershell
ssh-add C:\Users\Multicards\.ssh\github_multisolucioneslv
ssh-add -l
```

Para comprobar autenticación (GitHub puede devolver código de salida 1 aun con el saludo de éxito, porque no ofrece shell):

```powershell
ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -i C:\Users\Multicards\.ssh\github_multisolucioneslv -T git@github.com
```

## Todo lo incluido en el primer respaldo

Se subió el árbol versionado completo y su historial, no una copia parcial de la página:

- `src/`: páginas de inicio, servicios, proyectos, recursos (Quelea y drivers), preferencias de contacto, acciones de servidor, estilos, favicon, navegación, formularios, banderas, temas y configuración i18n/proxy.
- `messages/en.json`, `es.json`, `pt.json`, `ko.json`: traducciones de los cuatro idiomas.
- `public/`: los SVG versionados actuales (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). Esto no implica que ya estén creados o integrados el logo definitivo y todos los iconos pendientes.
- `automation/contact-ack.mjs` y `automation/contact-ack.test.mjs`: lógica del acuse y sus 42 pruebas locales.
- `database/migrations/001_multisoluciones_web_contact_preferences.sql`: migración de estructura, no datos de clientes.
- `docs/contacto/README.md`: funcionamiento y estado del contacto.
- `docs/superpowers/specs/` y `docs/superpowers/plans/`: diseños y planes de trabajo, incluido correo entrante/Telegram.
- `docs/_retirados-2026-10-02/`: documentación histórica preservada.
- `.gitignore`, `AGENTS.md`, `CLAUDE.md`, `CHECKPOINT.md`, `README.md`: reglas y documentación.
- `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`: dependencias y configuración reproducible.

Los nueve commits iniciales, del más antiguo al más reciente:

| Commit | Contenido |
| --- | --- |
| b3ab307 | checkpoint del proyecto local recuperado |
| 8fb256b | especificación del rediseño |
| 5663905 | plan de implementación local |
| dea6a2a | formato del plan |
| 3e49ac8 | implementación del rediseño Multisoluciones Web |
| af8288a | diseño de integración local de prueba n8n |
| 5727170 | conexión del formulario con n8n publicado |
| da9c919 | diseño aprobado de correo y Telegram |
| 8f39ee5 | lógica y pruebas de acuses bilingües/preferencias |

El historial conserva versiones anteriores, incluso archivos retirados del árbol actual. No confundir una versión histórica con el estado de producción.

Para consultar el inventario exacto del primer respaldo y su historial:

```powershell
git ls-tree -r --name-only 8f39ee5
git log --oneline 8f39ee5
```

## Lo que GitHub NO respalda

- `.env*`, contraseñas, claves SSH y credenciales n8n.
- `node_modules`, `.next`, compilaciones y cachés ignorados.
- Datos vivos o dumps de PostgreSQL, buzones Mailcow, ejecuciones y configuración interna de n8n.
- Configuración `.git/config`, agente SSH ni archivo local `known_hosts`.
- Archivos de otros proyectos y assets no incorporados al árbol versionado.

Antes del primer push se revisaron nombres de archivos en todo el historial y patrones comunes de claves privadas, tokens y URLs con contraseñas; no se detectaron coincidencias. Es una revisión preventiva, no una garantía absoluta frente a cualquier secreto posible.

Subir commits no despliega el sitio ni publica el flujo n8n. La lógica local del acuse y el borrador n8n son cambios distintos; la publicación de las nuevas etapas permanece pendiente de verificación.

El respaldo del flujo previo a estos ajustes está en el VPS de Multisoluciones: `/opt/multisoluciones-web-backups/20261004-contact-flow/contact-workflow-before.json`, con permisos 600. No es un respaldo de la base de datos ni contiene las claves privadas de GitHub.

## Trabajo y recuperación

Dentro de la carpeta del proyecto:

```powershell
git status --short --branch
git diff
git add RUTA_DEL_ARCHIVO_REVISADO
git commit -m "Descripción del cambio"
git push origin main
git rev-parse HEAD
git ls-remote origin refs/heads/main
```

Revisar lo que se añade antes de hacer commit; no subir secretos aunque el repositorio sea privado. Los dos últimos comandos permiten comparar el commit local con GitHub. Los cambios sin commit ni push siguen existiendo solamente en la computadora.

En una computadora nueva: instalar Git/Node compatibles, autorizar su propia clave SSH, clonar el repositorio privado, ejecutar `npm ci` y restaurar las variables necesarias desde almacenamiento seguro. No copiar `node_modules` ni suponer que GitHub contiene los entornos o la base de datos. Para revisar un estado anterior, usar una carpeta o rama de recuperación; no sobrescribir cambios actuales con un reset destructivo.

Diagnóstico rápido:

- `Permission denied (publickey)`: comprobar clave cargada, huella y cuenta GitHub.
- Error de huella del servidor: verificar la identidad del servidor antes de corregir `known_hosts`.
- Push rechazado porque existe trabajo remoto nuevo: revisar/fetch antes de integrar; no usar force push por defecto.
- Clave perdida: registrar otra desde una sesión GitHub autorizada; conservar el acceso y recuperación de la cuenta por separado.
