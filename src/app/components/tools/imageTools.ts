/**
 * @description set image url with resolution and quality
 * @param urlImage image url
 * @param x image width
 * @param y image height
 * @param quality image quality
 * @returns setted image url
 */
export function setUrlImage(
  urlImage: string,
  x: number,
  y: number,
  quality: number,
) {
  return urlImage
    .replace('{resolutionXY}', x.toString() + 'x' + y.toString())
    .replace('{imageQualityPercentage}', quality.toString());
}
