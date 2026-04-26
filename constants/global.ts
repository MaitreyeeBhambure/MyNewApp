export let globalConnection = false;

export const setGlobalConnection = (val: boolean) => {
  globalConnection = val;
};

export const getGlobalConnection = () => globalConnection;