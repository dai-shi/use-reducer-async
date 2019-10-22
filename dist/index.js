var e=require("react");exports.useReducerAsync=function(r,u,c,n){var a=n||c,t=e.useReducer(r,u,n&&c),s=t[1];return[t[0],e.useCallback((function(e){var r=(e||{}).type,u=r&&a[r]||null;u?u(s)(e):s(e)}),[a])]};
//# sourceMappingURL=index.js.map
