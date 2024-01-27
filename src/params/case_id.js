export function match(param) {
  // Firebase document IDs consist of 20 alphanumeric characters
  return /^[A-Za-z0-9]{20}$/.test(param)
}
