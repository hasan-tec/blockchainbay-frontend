declare module 'js-cookie' {
    function get(name: string): string | undefined;
    function set(name: string, value: string, options?: any): string | undefined;
    function remove(name: string, options?: any): void;
    const exports: {
      get: typeof get;
      set: typeof set;
      remove: typeof remove;
    };
    export default exports;
  }