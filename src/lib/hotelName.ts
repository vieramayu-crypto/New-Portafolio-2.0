/** Marcas que no siguen la caja de titulo: GPRO son siglas e InterContinental
 *  lleva la C interior en mayuscula. Sin esto salian como "Gpro" e
 *  "Intercontinental", que es escribir mal el nombre del cliente. */
const BRAND_CASING: Record<string, string> = {
  gpro: 'GPRO',
  intercontinental: 'InterContinental',
};

/** Los nombres viven en mayusculas en los datos y aqui se pasan a caja de
 *  titulo. Hay que capitalizar tambien detras de un guion o una barra, no solo
 *  detras de un espacio: THE RITZ-CARLTON salia como "The Ritz-carlton". */
export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s\-–—/(])(\S)/g, (_, antes, letra) => antes + letra.toUpperCase())
    .replace(/\b\w+\b/g, (palabra) => BRAND_CASING[palabra.toLowerCase()] ?? palabra);
}
