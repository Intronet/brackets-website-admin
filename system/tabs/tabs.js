/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999 */
/*global $, Node, EJS, define, Mustache, brackets, debugger, window, console, eval */
var
   PF = brackets.getModule("preferences/PreferencesManager"),
   prefs = PF.getExtensionPrefs("brackets-website-admin");
if(prefs.get("tabs") !== undefined && prefs.get("tabs") === true){
   
   define(["require", "exports", 'module', './sys/init'], function (require, exports, module, init) {
   "use strict";
   });
}  