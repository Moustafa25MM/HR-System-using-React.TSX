export const asycnWrapper = (promise: Promise<any>) =>
  promise.then((data) => [undefined, data]).catch((error) => [error]);
