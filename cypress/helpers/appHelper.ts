export const getApp = () => cy.window().its("vueApp");

export const getStore = () => getApp().its("$store");

// export const getStoreSubmobule = (submoduleName: string) => get

export function fillStore(storeName: string, mutationName: string,
                          payload: unknown) {
  return getStore().then((store) => {
    store.commit(`${storeName}/${mutationName}`, payload);
  });
}

export const getRouter = () => getApp().its("$router");

export const getRoute = () => getApp().its("$route");

export const navigateInApp = (url: string) => getRouter().then((router) => router.push(url));
