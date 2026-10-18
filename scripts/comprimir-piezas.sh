#!/usr/bin/env bash
#
# COMPRIMIR LAS PIEZAS VERTICALES PARA SERVIRLAS DESDE LA WEB.
#
#   bash scripts/comprimir-piezas.sh <carpeta-de-originales> <carpeta-de-salida>
#
# De cada original saca tres archivos: `<nombre>.mp4`, `<nombre>.webm` y
# `<nombre>.jpg` (la portada).
#
# POR QUÉ 540x960 Y NO MÁS. Es lo que pide la pantalla de verdad. En el móvil
# cada celda del mosaico mide 167px de ancho, que en una pantalla de tres veces
# la densidad son unos 500 reales; en escritorio mide 230px, unos 460. Más
# resolución que ésta no se ve, sólo pesa y gasta batería. Los originales son
# masters 4K en H.265 de 10 bits, pensados para otra cosa.
#
# ESTO SE SALTA LA REGLA DE "MÁXIMA CALIDAD SIEMPRE" A PROPÓSITO, y es decisión
# de Mayurlin: en seis vídeos de 167px moviéndose a la vez no se nota, y seis
# masters a la vez no los sostiene ningún móvil. La regla sigue intacta para
# las fotos.
#
# SIN PISTA DE AUDIO. En la web van mudos, así que el audio sería peso y
# trabajo de decodificación para nada. Además un vídeo sin audio se
# autorreproduce en cualquier navegador sin pedir permiso.
#
# DOS FORMATOS. El mp4 (H.264) lo entiende todo lo que existe; el webm (VP9)
# es el respaldo, y además es el único que se puede comprobar desde el entorno
# del agente, cuyo Chromium no lleva H.264.
#
# SE RECORTAN LOS FOTOGRAMAS NEGROS DEL FINAL. Es lo que provocaba el
# pantallazo negro al cerrar el bucle. `blackdetect` los busca y, si los hay
# pegados al final, el vídeo se corta justo antes.
#
set -euo pipefail

ORIGENES="${1:?Falta la carpeta de originales}"
SALIDA="${2:?Falta la carpeta de salida}"
mkdir -p "$SALIDA"

# CALIDAD. Medido sobre la pieza más pesada (Stic Urban, azotea, 30s de 4K),
# comparando cada compresión contra una copia casi sin comprimir:
#
#   crf 26 -> 5,94 MB | 38,98 dB a 540px | 45,07 dB al tamaño real de móvil
#   crf 28 -> 4,55 MB | 37,72 dB        | 43,49 dB
#   crf 30 -> 3,44 MB | 36,48 dB        | 41,85 dB
#
# La columna que manda es la última: a 168px de ancho, que es lo que ocupa de
# verdad una celda en el móvil, cualquiera de las tres pasa de 40 dB, que es
# donde la diferencia deja de verse. Así que 28, que ahorra un 23% sobre 26 y
# deja margen de sobra. Si algún día hace falta aligerar más, 30 sigue siendo
# defendible; de ahí para arriba ya se ensucia.
#
# El webm es sólo el respaldo (lo usa un navegador que no entienda H.264, que
# hoy no es casi ninguno), así que va un punto por debajo.
CRF_MP4=28
CRF_WEBM=36
ANCHO=540
ALTO=960

for origen in "$ORIGENES"/*.mp4 "$ORIGENES"/*.mov "$ORIGENES"/*.MP4 "$ORIGENES"/*.MOV; do
  [ -e "$origen" ] || continue
  nombre="$(basename "${origen%.*}")"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$origen")

  # ¿Negro pegado al final? Se mira el último segundo y medio.
  fin=""
  negro=$(ffmpeg -hide_banner -v info -i "$origen" -vf blackdetect=d=0.08:pic_th=0.98 -f null - 2>&1 \
          | grep -o 'black_start:[0-9.]* black_end:[0-9.]*' | tail -1 || true)
  if [ -n "$negro" ]; then
    ini=$(echo "$negro" | sed 's/black_start:\([0-9.]*\).*/\1/')
    fin_negro=$(echo "$negro" | sed 's/.*black_end:\([0-9.]*\).*/\1/')
    # Sólo cuenta si llega hasta el final del archivo.
    if awk "BEGIN{exit !($fin_negro > $dur - 0.25)}"; then
      fin="-t $ini"
      echo "  $nombre: negro final desde ${ini}s, se recorta"
    fi
  fi

  echo "  $nombre: comprimiendo"

  # shellcheck disable=SC2086
  ffmpeg -hide_banner -v error -y -i "$origen" $fin \
    -vf "scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase,crop=${ANCHO}:${ALTO},format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf $CRF_MP4 \
    -g 48 -keyint_min 48 -sc_threshold 0 \
    -movflags +faststart -an "$SALIDA/$nombre.mp4"

  # shellcheck disable=SC2086
  ffmpeg -hide_banner -v error -y -i "$origen" $fin \
    -vf "scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase,crop=${ANCHO}:${ALTO},format=yuv420p" \
    -c:v libvpx-vp9 -crf $CRF_WEBM -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
    -an "$SALIDA/$nombre.webm"

  # La portada: un fotograma del segundo 1, que casi nunca es el negro de
  # entrada. Es lo que se ve mientras el vídeo todavía no ha llegado.
  ffmpeg -hide_banner -v error -y -ss 1 -i "$origen" -frames:v 1 \
    -vf "scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase,crop=${ANCHO}:${ALTO}" \
    -q:v 4 "$SALIDA/$nombre.jpg"
done

echo
echo "Resultado:"
ls -la "$SALIDA"
