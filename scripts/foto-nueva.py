#!/usr/bin/env python3
"""PUBLICA UNA FOTO NUEVA SIN PERDER CALIDAD, Y SIN OLVIDARSE DE NADA.

    python3 scripts/foto-nueva.py originales/DJI_0123.jpg sec6-gal11-terraza-h

De un archivo original saca TODO lo que la web necesita de esa foto:

    public/images/<nombre>.jpg          el archivo principal
    public/images/m/<nombre>.jpg        la copia de móvil, 900px
    public/images/w<ancho>/<nombre>.jpg la escalera, un archivo por tamaño

y escribe por pantalla la línea que hay que añadir a `ESCALERA` en
`src/lib/foto.ts`.

POR QUÉ EXISTE ESTE SCRIPT, que son tres lecciones pagadas:

1. SIN LA COPIA DE MÓVIL LA FOTO SALE ROTA. La web sirve a los teléfonos una
   copia ligera desde `images/m/` con `<picture>` y `media`. Un `<source>`
   que casa con el `media` y da 404 NO cae al archivo de respaldo: el
   navegador deja el hueco vacío. Pasó con la aérea de Deltapark.

2. DARLE AL NAVEGADOR UN ARCHIVO MÁS GRANDE QUE EL HUECO LA EMPEORA. Él la
   reduce con un filtro barato. Medido con la misma foto en una caja de 1920:
   un archivo de 5120 reducido por el navegador deja el 87% del detalle; el
   mismo recorte ya guardado a 1920 deja el 101%. De ahí la escalera: cada
   pantalla se lleva su medida, ya reducida bien aquí con Lanczos.

3. LA CALIDAD AL GUARDAR NO SE NEGOCIA. `quality=97, subsampling=0`, que es
   la regla de la casa. El default de PIL (~75) y los valores "razonables"
   como 90 se comen el detalle fino, y en una foto de hotel eso es justo lo
   que se vende.

QUÉ NOMBRE PONERLE. `sec{N}-gal{NN}-{tema}-{h|v|c}`, donde N es la sección
del hotel (Espléndido es la 6, Deltapark la 3; mirar `data/hotels.ts`), NN el
siguiente número libre de esa galería, y la última letra la forma: h
horizontal, v vertical, c cuadrada.

DESPUÉS DE PASARLO quedan dos pasos a mano, a propósito, porque son
decisiones y no mecánica:
  - añadir la foto a `galleryPhotos` del hotel en `data/hotels.ts`, en el
    lugar del recorrido que le toque, con su texto alternativo;
  - traducir ese texto en `data/textosEn.ts`, que indexa por el español.
"""
import os
import sys

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGENES = os.path.join(RAIZ, 'public', 'images')

# La regla de la casa para todo lo que se ve en pantalla grande. No bajar.
CALIDAD = 97
SUBMUESTREO = 0

# LA COPIA DE MÓVIL VA MÁS LIGERA, y es a propósito. A 900px de ancho la
# diferencia entre calidad 88 y 97 no se ve en un teléfono, y sí se nota en
# lo que tarda en cargar: 200 KB contra 520. Es el mismo criterio con el que
# están hechas las otras 127 copias de `images/m/`, que pesan entre 150 y
# 320 KB. El ancho, 900, es el doble de lo que cabe en un móvil, para que se
# vean nítidas en pantallas retina. Ver `src/lib/foto.ts`.
ANCHO_MOVIL = 900
CALIDAD_MOVIL = 88

# La escalera. Los anchos cubren lo que piden las pantallas reales: 1440 y
# 1920 normales, 2560 de un monitor grande, 2880 y 3024 de los portátiles
# retina (1440 y 1512 a 2x), y 3840 y 5120 de 4K y 5K. Un ancho mayor que el
# original no se genera: ampliar no añade detalle, sólo peso.
ESCALERA = [1440, 1920, 2560, 2880, 3024, 3840, 5120]


def guardar(imagen: Image.Image, destino: str, calidad: int = CALIDAD) -> float:
    os.makedirs(os.path.dirname(destino), exist_ok=True)
    submuestreo = SUBMUESTREO if calidad >= 95 else 2
    imagen.save(destino, 'JPEG', quality=calidad, subsampling=submuestreo, optimize=True)
    return os.path.getsize(destino) / 1024 / 1024


def ancho_a(imagen: Image.Image, ancho: int) -> Image.Image:
    alto = round(ancho * imagen.size[1] / imagen.size[0])
    return imagen.resize((ancho, alto), Image.LANCZOS)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    origen, nombre = sys.argv[1], sys.argv[2]
    if nombre.endswith('.jpg'):
        nombre = nombre[:-4]
    if not os.path.exists(origen):
        raise SystemExit(f'No encuentro {origen}')

    original = Image.open(origen)
    original.load()
    ancho_original = original.size[0]
    print(f'original: {original.size[0]}x{original.size[1]}')

    archivo = f'{nombre}.jpg'

    # El principal: el mayor de la escalera que quepa en el original, para que
    # quien no entienda `srcset` reciba algo sensato y no el de 5120.
    principal = max([a for a in ESCALERA if a <= ancho_original] or [ancho_original])
    peso = guardar(ancho_a(original, principal), os.path.join(IMAGENES, archivo))
    print(f'\nprincipal  images/{archivo}  {principal}px  {peso:.2f} MB')

    peso = guardar(ancho_a(original, ANCHO_MOVIL), os.path.join(IMAGENES, 'm', archivo), CALIDAD_MOVIL)
    print(f'móvil      images/m/{archivo}  {ANCHO_MOVIL}px  {peso:.2f} MB')

    print('\nescalera:')
    usados = []
    for ancho in ESCALERA:
        if ancho > ancho_original:
            print(f'   {ancho:5}px  (saltado: el original sólo tiene {ancho_original}px)')
            continue
        peso = guardar(ancho_a(original, ancho), os.path.join(IMAGENES, f'w{ancho}', archivo))
        usados.append(ancho)
        print(f'   {ancho:5}px  {peso:.2f} MB')

    print('\nFALTA UN PASO A MANO: añadir esta línea a `ESCALERA` en src/lib/foto.ts')
    print(f"  '{archivo}': {usados},")
    print('\ny luego meter la foto en `galleryPhotos` del hotel (data/hotels.ts)')
    print('con su texto alternativo, y traducirlo en data/textosEn.ts.')


if __name__ == '__main__':
    main()
