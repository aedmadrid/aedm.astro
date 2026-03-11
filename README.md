# aedm.astro

Repositorio del sitio Astro de AEDM y Dockerfile para producir una imagen estática (NGINX) que sirve `dist/`.

Objetivo de despliegue: siempre `linux/amd64`.

Resumen rápido
- En macOS: usa CI (GitHub Actions) para construir la imagen amd64 (recomendado).
- En Linux (amd64): construye y publica localmente con `docker buildx`.

Requisitos
- bun (para builds locales): https://bun.sh/
- docker + buildx
- (opcional) gh CLI

Notas importantes
- Asegúrate de que `bun.lock` esté comiteado.
- Bun puede fallar bajo emulación amd64 en macOS (SIGILL). Por eso recomendamos usar CI en mac.

Flujos concretos

1) macOS — usar CI (recomendado)
- Push a `main` o ejecutar el workflow `.github/workflows/docker.yml`.
- La imagen resultante se publica en `ghcr.io/aedmadrid/aedm.astro:latest`.
- Ejecutar la imagen remota:
  - `docker run -d -p 80:80 ghcr.io/aedmadrid/aedm.astro:latest`

2) Linux (amd64) — build y push local
- Login a GHCR (si vas a push):
  - `echo $CR_PAT | docker login ghcr.io -u TU_USUARIO --password-stdin`
- Build & push:
  - `docker buildx build --platform linux/amd64 -t ghcr.io/aedmadrid/aedm.astro:latest --push .`
- Para probar local sin push:
  - `docker buildx build --platform linux/amd64 -t aedm.astro:local --load .`
  - `docker run --rm -p 8080:80 aedm.astro:local`

Opción alternativa (si quieres compilar `dist/` localmente en mac y luego crear la imagen amd64):
1. `bun install && bun run build`
2. Usar `Dockerfile.dist` que solo copia `dist/` a `nginx` y luego:
   - `docker buildx build --platform linux/amd64 -t ghcr.io/aedmadrid/aedm.astro:latest --file Dockerfile.dist --push .`

Problemas comunes
- Si Bun falla con SIGILL en buildx en mac: usa CI o construye `arm64` localmente y/o compila `dist/` localmente como alternativa.
- Si hay errores de lockfile: regenera `bun.lock` localmente con `bun install` y commitea.
