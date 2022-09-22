export function classNames(...names: Array<string | any>) {
  return names.filter((name) => typeof name === 'string').join(' ');
}
