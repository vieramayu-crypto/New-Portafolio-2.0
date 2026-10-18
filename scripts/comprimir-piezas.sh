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
# donde la diferencia deja de verse.
#
# SE ELIGIÓ 30, Y NO POR AHORRAR DISCO. Con 28 el conjunto pesaba 13,8 MB y
# Mayurlin vio los vídeos colgados: en una conexión normal, siete piezas que
# se piden a la vez no juntan búfer para arrancar ninguna. Cada MB que se
# quita es un segundo menos de recuadro parado. A 41,85 dB al tamaño real,
# bajar de 28 a 30 no se ve; que el vídeo tarde diez segundos en arrancar, sí.
# De 30 para arriba ya se ensucia, así que ahí está el suelo.
#
# El webm es sólo el respaldo (lo usa un navegador que no entienda H.264, que
# hoy no es casi ninguno), así que va un punto por debajo.
CRF_MP4=30
CRF_WEBM=38
ANCHO=540
ALTO=960

# EL RECORTE QUE SE COME LAS BANDAS NEGRAS DEL BORDE.
#
# Mayurlin: "en algún punto de su reproducción le salen líneas negras en los
# bordes, en unos a la izquierda, en otros abajo o arriba". No era la web: las
# bandas vienen DENTRO de los archivos, en momentos sueltos del metraje, y se
# notan porque el mosaico va sobre marfil claro.
#
# CÓMO SE MIDE UNA BANDA, que es lo que costó. No vale mirar si el borde está
# oscuro: una escena oscura también lo está. Lo que delata a una banda es que
# la línea del borde sea mucho más oscura que la de cinco píxeles adentro,
# donde el contenido sigue intacto. Se mide con `blend=subtract` entre las dos
# líneas, fotograma a fotograma de todo el clip. Resultado sobre los
# originales, contando fotogramas con más de 30 niveles de diferencia:
#
#   deltapark   40 en los CUATRO bordes (hasta 57)
#   stic-roof   29 arriba (hasta 206)
#   stic-rest.  35 a la izquierda (hasta 85)
#   gpro-dia     4 abajo (hasta 150)
#   ritz         4 a la derecha, 1 abajo
#
# Con el 1% por lado no queda ninguno. Se probó también el 1,5% y no mejora
# nada: lo único que sigue saliendo es el marco oscuro de una puerta de cristal
# en la pieza de Ritz, que es contenido y no un defecto, así que se queda el 1%
# y el encuadre se mueve lo mínimo. Al recortar ANTES de escalar no cuesta
# nitidez, porque sale igualmente de una imagen mucho mayor que los 540
# finales.
MARGEN=0.98

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
    -vf "crop=iw*${MARGEN}:ih*${MARGEN},scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase,crop=${ANCHO}:${ALTO},format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf $CRF_MP4 \
    -g 48 -keyint_min 48 -sc_threshold 0 \
    -movflags +faststart -an "$SALIDA/$nombre.mp4"

  # shellcheck disable=SC2086
  ffmpeg -hide_banner -v error -y -i "$origen" $fin \
    -vf "crop=iw*${MARGEN}:ih*${MARGEN},scale=${ANCHO}:${ALTO}:force_original_aspect_ratio=increase,crop=${ANCHO}:${ALTO},format=yuv420p" \
    -c:v libvpx-vp9 -crf $CRF_WEBM -b:v 0 -row-mt 1 -deadline good -cpu-used 2 \
    -an "$SALIDA/$nombre.webm"

  # LA PORTADA ES LO PRIMERO QUE SE VE, ASÍ QUE PESA LO MÍNIMO.
  # Mientras el vídeo no tiene ni un fotograma, la celda enseña esto; si la
  # portada tampoco ha llegado, lo que se ve es un rectángulo negro, que es
  # lo que salía en la captura de Mayurlin. A la mitad de ancho y con más
  # compresión baja de unos 80 KB a unos 20: llegan las siete en el primer
  # segundo y ninguna celda nace negra. Se nota poco porque debajo entra el
  # vídeo a los pocos segundos.
  ffmpeg -hide_banner -v error -y -ss 1 -i "$origen" -frames:v 1 \
    -vf "crop=iw*${MARGEN}:ih*${MARGEN},scale=$((ANCHO/2)):$((ALTO/2)):force_original_aspect_ratio=increase,crop=$((ANCHO/2)):$((ALTO/2))" \
    -q:v 6 "$SALIDA/$nombre.jpg"
done

echo
echo "Resultado:"
ls -la "$SALIDA"
