!function(r,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.vdbststd=t():r.vdbststd=t()}(this,(function(){return function(r){var t={};function e(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return r[n].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=r,e.c=t,e.d=function(r,t,n){e.o(r,t)||Object.defineProperty(r,t,{enumerable:!0,get:n})},e.r=function(r){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(r,"__esModule",{value:!0})},e.t=function(r,t){if(1&t&&(r=e(r)),8&t)return r;if(4&t&&"object"==typeof r&&r&&r.__esModule)return r;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:r}),2&t&&"string"!=typeof r)for(var o in r)e.d(n,o,function(t){return r[t]}.bind(null,o));return n},e.n=function(r){var t=r&&r.__esModule?function(){return r.default}:function(){return r};return e.d(t,"a",t),t},e.o=function(r,t){return Object.prototype.hasOwnProperty.call(r,t)},e.p="",e(e.s=0)}([function(r,t,e){"use strict";function n(r){return function(){try{var t=r(...arguments);return t instanceof o?t:i(t)}catch(r){if(r&&r.IS_STD_ERR){var e=u(r.reason);return e.stack=r.stack,e}throw r}}}e.r(t);class o{constructor(r,t){this.state=r,this.value=t,this._errorHandlerRegistered=!1}is_err(){return"Err"===this.state}is_ok(){return"Ok"===this.state}or_Fail(){return this._errorHandlerRegistered=!0,this.is_err()&&function(r){var t=new Error("Uncatched error Result!");throw t.reason=r,t.IS_STD_ERR=!0,t}(this.value),this.value}or(r){return this._errorHandlerRegistered=!0,this.is_err()?i(r):this}and(r){return this.is_ok()?i(r):this}unwrap(){if(this._errorHandlerRegistered=!0,"Ok"===this.state)return this.value;var r;if("string"==typeof this.value)throw(r=new Error(this.value)).originalStack=this.stack,r;throw(r=new Error(this.value.toString())).originalStack=this.stack,r}static Ok(r){if(void 0===r)return u("no result given to Ok");if("function"==typeof r){var t=r();return typeof t==Object&&t instanceof o?t:new o("Ok",t)}return typeof r==Object&&r instanceof o?r:new o("Ok",r)}static Err(r){if(void 0===r)return u("no reason given to Err");if("function"==typeof r){var t=r();return typeof t==Object&&t instanceof o?t:new o("Err",t)}return typeof r==Object&&r instanceof o?r:new o("Err",r)}}function i(r){return o.Ok(r)}function u(r){return o.Err(r)}function s(r,t){return r instanceof o?(t.Err&&(r._errorHandlerRegistered=!0),r.is_ok()?t.Ok&&t.Ok(r.value):t.Err&&t.Err(r.value)):"string"==typeof r?t[r]?t[r](r):t._&&t._(r):"number"==typeof r?t[r]?t[r](r):t._&&t._(r):void 0}e.d(t,"fn",(function(){return n})),e.d(t,"Result",(function(){return o})),e.d(t,"Ok",(function(){return i})),e.d(t,"Err",(function(){return u})),e.d(t,"match",(function(){return s}))}])}));