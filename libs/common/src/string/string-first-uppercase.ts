/**
 *
 *  TODO this is an old function
 * @param value
 */
export function firstUppercase(name: string): string {

  const new_string = name.replace(/and|ANd|AND|AnD|anD/g, "&");
  const arr = new_string.split(" ");

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1).toLowerCase();
  }
  let final_tag = arr.join(" ")
  return final_tag;
}

//TODO refactor this
export function firstUppercaseAfterHyphen(name: string): string {

  const arr = name.split("-").join(",").split(',').join(' ').split(' ');
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() +  arr[i].slice(1).toLowerCase();
  }
  let final_ = arr.join(" ")
  return final_;
}


export function parseDMY(s: string):string {
  return new Date(s.replace(/ GMT.*/,'')).toLocaleDateString('en-GB');
}
