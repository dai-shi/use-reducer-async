import{useReducer as r,useCallback as t}from"react";function n(n,o,e,a){var c=a||e,f=r(n,o,a&&e),i=f[1];return[f[0],t((function(r){var t=c[r.type];t?t(i)(r):i(r)}),[c])]}export{n as useReducerAsync};
//# sourceMappingURL=index.esm.js.map
