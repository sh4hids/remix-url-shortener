export function singleton<Value>(name: string, value: () => Value): Value {
  const customGlobal = global as any;

  customGlobal.__singletons ??= {};
  customGlobal.__singletons[name] ??= value();

  return customGlobal.__singletons[name];
}
