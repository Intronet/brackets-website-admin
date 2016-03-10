/*
* strings.js
* Author: Denisov21
* Github: https://github.com/Denisov21
*
* Made available under a MIT License:
* http://www.opensource.org/licenses/mit-license.php
*
* strings.js Copyright Denisov21 2014.
*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */
define(function (require, exports, module) {
"use strict";
   var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs = PF.getExtensionPrefs("brackets-website-admin");
   if(prefs.get("pop-up-menu") === false){
      return false;
   }    
module.exports = require("i18n!./nls/strings");
});
