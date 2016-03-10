/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999 */
/*global $, Node, EJS, define, Mustache, brackets, debugger, window, console, eval */
define(["require", "exports", "module", "./viewTab", "./features"],
   function (e, t, s, i, n) {
      "use strict";
      var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs = PF.getExtensionPrefs("brackets-website-admin");
      if(prefs.get("tabs") === undefined || prefs.get("tabs") === false){
         return false;
      }
      var a = brackets.getModule("utils/AppInit");
      a.htmlReady(function () {
         brackets.getModule("utils/ExtensionUtils").loadStyleSheet(s, "./cap.css");
         brackets.getModule("utils/ExtensionUtils").loadStyleSheet(s, "./iconpackage.css");
      });
      a.extensionsLoaded(function () {
         i.viewTab();
      });
      a.appReady(function () {
            //n.firstRun(), i.keys()
      });

   });
