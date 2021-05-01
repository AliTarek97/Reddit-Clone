// if we are on the server side window keyword will be undefined
export const isServer = () => typeof window === 'undefined';