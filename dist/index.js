var e=require("react");exports.useReducerAsync=function(r,u,c,a){var n=a||c,t=e.useReducer(r,u,a&&c),s=t[1];return[t[0],e.useCallback((function(e){var r=n[e.type];r?r(s)(e):s(e)}),[n])]};
//# sourceMappingURL=index.js.map
