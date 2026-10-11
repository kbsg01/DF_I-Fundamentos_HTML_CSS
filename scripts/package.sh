#!/usr/bin/env bash
# Genera el .zip de entrega con el nombre exigido por la institución:
#   nombre_Alumno_SiglaCurso_EFT_FRONT_END_I.zip
# Uso: ALUMNO=Karla_Apellido npm run package
# Excluye dependencias, builds y metadatos de git (se reconstruyen con `npm ci`).
set -euo pipefail

ALUMNO="${ALUMNO:?Define ALUMNO, p. ej.: ALUMNO=Nombre_Apellido npm run package}"
SIGLA="PFY2201"
DEST_NAME="${ALUMNO}_${SIGLA}_EFT_FRONT_END_I"
OUT_DIR="$(pwd)/.."
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/$DEST_NAME"
# tar copia el proyecto aplicando exclusiones, sin tocar el original
tar --exclude=./node_modules --exclude=./dist --exclude=./coverage --exclude=./.git --exclude='*.zip' -cf - . \
  | tar -xf - -C "$STAGE/$DEST_NAME"
(cd "$STAGE" && zip -qr "$OUT_DIR/${DEST_NAME}.zip" "$DEST_NAME")
echo "Creado: ${OUT_DIR}/${DEST_NAME}.zip"
