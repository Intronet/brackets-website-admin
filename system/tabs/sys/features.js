/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999 */
/*global $, Node, EJS, define, Mustache, brackets, debugger, window, console, eval, localStorage */
define(function (require, exports, module) {
   "use strict";
   var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs = PF.getExtensionPrefs("brackets-website-admin");
   if(prefs.get("tabs") === undefined || prefs.get("tabs") === false){
      return false;
   }
      
   
   
   var Dialogs = brackets.getModule("widgets/Dialogs"),
      Strings = brackets.getModule("strings"),
      Menus = brackets.getModule('command/Menus'),
      viewMenu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU),
      CommandManager = brackets.getModule('command/CommandManager'),
      Commands = brackets.getModule("command/Commands"),
      PreferencesManager = brackets.getModule('preferences/PreferencesManager'),
      preferences = PreferencesManager.getExtensionPrefs("sys-tab"),
      prefHoverSidebar = "hoverSidebar",
      prefTooltip = "tooltip",
      prefWorkingFiles = "workingFilesSidebar",
      prefZIndex = "zIndex",
      prefStepWheel = "stepWheel",
      versionId = "sys-tabs-version-in-localStorage",
      version = 502,
      getVersion = localStorage.getItem(versionId),
      settingsDialogTemplate = require('text!./prefs.html');

   function addCommandMenu(name, id, fn, pos, rel) {
      CommandManager.register(name, id, fn);
      viewMenu.addMenuItem(id, "", pos, rel);
   }

   function forFirstRun() {
      var getPref = function (pref) {
            return preferences.get(pref);
         },
         number = function (pref, def) {
            return ("number" !== typeof getPref(pref)) ? def : getPref(pref);
         },
         setPref = function (elem) {
            preferences.set(prefZIndex, parseInt(elem.find("#sys-tabs-zIndex").val(), 10));
            preferences.set(prefStepWheel, parseInt(elem.find("#sys-tabs-stepWheel").val(), 10));
            preferences.set(prefWorkingFiles, elem.find("#sys-tabs-workingFilesSidebar").is(":checked"));
            preferences.set(prefHoverSidebar, elem.find("#sys-tabs-hoverSidebar").is(":checked"));
            preferences.set(prefTooltip, elem.find("#sys-tabs-tooltip").is(":checked"));
            preferences.save();
         },
         prefsStore = function (elem) {
            elem.find("#sys-tabs-zIndex").val(number(prefZIndex, 11));
            elem.find("#sys-tabs-stepWheel").val(number(prefStepWheel, 40));
            elem.find("#sys-tabs-workingFilesSidebar").prop('checked', getPref(prefWorkingFiles));
            elem.find("#sys-tabs-hoverSidebar").prop('checked', getPref(prefHoverSidebar));
            elem.find("#sys-tabs-tooltip").prop('checked', getPref(prefTooltip));
         },
         compiledTemplate = Mustache.render(settingsDialogTemplate, Strings),
         dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true);
      prefsStore(dialog.getElement());
      dialog.done(function (i) {
         if ("cancel" === i || "dontsave" === i) {
            return;
         } else if ("ok" === i) {
            setPref(dialog.getElement());
         }
      });
   }

   function firstRun() {
      if (version <= parseInt(getVersion, 10)) {
         return;
      }
      localStorage.setItem(versionId, version);
      forFirstRun();
   }


   function news() {
      if (version > parseInt(getVersion, 10)) {
         localStorage.setItem(versionId, version);
      }
   }
   module.exports = {
      firstRun: firstRun,
      news: news
   };
});
