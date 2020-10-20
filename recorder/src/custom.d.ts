declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare global {
  var showModal: (title: string, text: string, cancelable? : boolean) => Promise<boolean>
}