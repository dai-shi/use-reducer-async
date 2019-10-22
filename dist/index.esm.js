import{useReducer as r,useCallback as t}from"react";function n(n,o,e,u){var a=u||e,c=r(n,o,u&&e),f=c[1];return[c[0],t((function(r){var t=(r||{}).type,n=t&&a[t]||null;n?n(f)(r):f(r)}),[a])]}export{n as useReducerAsync};
//# sourceMappingURL=index.esm.js.map
