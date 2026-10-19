#!/usr/bin/env python3
"""GENERA `data/miniaturas.ts` A PARTIR DE LAS PORTADAS DE `public/videos/`.

    python3 scripts/miniaturas.py

QUÉ HACE. Coge cada portada (`<pieza>.jpg`), la reduce a 12x21 píxeles y la
mete en el código como `data:` en base64. Son unos 500 caracteres por pieza,
3,6 KB entre las siete.

PARA QUÉ. El mosaico de verticales pintaba recuadros NEGROS mientras llegaban
las portadas: un `<video>` sin fotogramas se pinta negro, y las portadas
compiten con las fotos de la propia página. Mayurlin lo vio en escritorio:
"a las columnas les cuesta aparecer... y después aparece de golpe". Con la
miniatura dentro del paquete, la celda tiene el color de su escena desde el
primer fotograma y sin tocar la red; encima llega la portada nítida, y encima
el vídeo. Ver `components/MosaicoVerticales.tsx`.

CUÁNDO VOLVER A PASARLO. Cuando cambie o se añada una portada en
`public/videos/`. Si no, el mosaico seguirá enseñando el color de la escena
antigua durante esa media décima de segundo.

La calidad baja es a propósito y no choca con la regla de máxima calidad de la
web: esto no sustituye a ninguna foto, vive debajo de la portada de verdad y
desaparece en cuanto llega.
"""
import base64
import glob
import io
import os

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTADAS = os.path.join(RAIZ, 'public', 'videos', '*.jpg')
SALIDA = os.path.join(RAIZ, 'data', 'miniaturas.ts')

# 12x21 es la proporción 9:16 de las piezas, lo bastante pequeño para que sea
# una mancha de color y no una foto reconocible.
ANCHO, ALTO, CALIDAD = 12, 21, 40

CABECERA = '''/* LAS MINIATURAS DE LAS PIEZAS, INCRUSTADAS EN EL CÓDIGO.
 *
 * GENERADO POR `scripts/miniaturas.py`. No editar a mano: volver a pasar el
 * script si cambia alguna portada.
 *
 * QUÉ SON Y POR QUÉ EXISTEN. Doce por veintiún píxeles de cada portada, en
 * JPEG de calidad 40. Estiradas al tamaño de la celda son una mancha de color
 * borrosa, y eso es exactamente lo que se quiere: el mosaico enseña el color
 * de cada escena DESDE EL PRIMER FOTOGRAMA, sin pedir un solo byte a la red,
 * y encima van llegando la portada nítida y después el vídeo.
 *
 * Mayurlin, en escritorio: "a las columnas les cuesta aparecer... no se
 * muestran hasta que finalmente se cargan los vídeos, y después aparece de
 * golpe". Medido a 12 Mbps: nueve recuadros NEGROS durante 1,8 segundos
 * incluso con las portadas pedidas por adelantado, porque compiten con las
 * fotos de la propia página. Con esto, cero.
 *
 * ESTO NO CONTRADICE LA REGLA DE MÁXIMA CALIDAD. No sustituye a ninguna foto:
 * vive DEBAJO de la portada de verdad y desaparece en cuanto ésta llega. Son
 * 4 KB en total dentro del paquete, no una descarga. */

export const MINIATURAS: Record<string, string> = {
'''


def main() -> None:
    filas = []
    for ruta in sorted(glob.glob(PORTADAS)):
        nombre = os.path.basename(ruta)[:-4]
        imagen = Image.open(ruta).convert('RGB').resize((ANCHO, ALTO), Image.LANCZOS)
        buf = io.BytesIO()
        imagen.save(buf, 'JPEG', quality=CALIDAD, optimize=True)
        b64 = base64.b64encode(buf.getvalue()).decode()
        filas.append((nombre, b64))
        print(f'{nombre:28} {len(b64):5} caracteres')

    if not filas:
        raise SystemExit(f'No encuentro ninguna portada en {PORTADAS}')

    cuerpo = ''.join(f"  '{n}':\n    'data:image/jpeg;base64,{b}',\n" for n, b in filas)
    with open(SALIDA, 'w', encoding='utf-8') as f:
        f.write(CABECERA + cuerpo + '};\n')
    print(f'\n{len(filas)} miniaturas, {sum(len(b) for _, b in filas)} caracteres -> {SALIDA}')


if __name__ == '__main__':
    main()
