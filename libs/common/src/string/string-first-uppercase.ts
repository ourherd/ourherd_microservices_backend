/**
 *
 *  TODO this is an old function
 * @param value
 */
export function stringFirstUppercase(name: string): string {
  const arr = name.split(" ");
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const str2 = arr.join(" ");
  return str2;
}

