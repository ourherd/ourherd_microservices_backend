/**
 *
 *  TODO this is an old function
 * @param value
 */
export function stringFirstUppercase(name: string): string {

  const new_string = name.replace(/and|ANd|AND|AnD|anD/g, "&");
  const arr = new_string.split(" ");

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const final_tag = arr.join(" ")

  return final_tag;
}

