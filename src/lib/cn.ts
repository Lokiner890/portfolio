type ClassValue = string | false | null | undefined;

export function cn(...classes: Array<ClassValue>) {
  return classes.filter(Boolean).join(' ');
}
