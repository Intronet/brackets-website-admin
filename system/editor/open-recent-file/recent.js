/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999

*/
/*global $, require, CryptoJS, Node, EJS, define, localStorage, Mustache, brackets, debugger, window, console, WebSocket

*/

(function(){
   var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs_ = PF.getExtensionPrefs("brackets-website-admin");
      if (prefs_.get("recent") !== undefined && prefs_.get("recent") === true) {
         require.config({
            paths: {
               "text": "lib/text",
               "i18n": "lib/i18n"
            },
            locale: brackets.getLocale()
         });
         define(function (require, exports, module) {
            'use strict';

            var WStrings = require("i18n!./nls/strings"),
               settingsDialogTemplate = require('text!./template.html'),
               AppInit = brackets.getModule('utils/AppInit'),
               MainViewManager = brackets.getModule("view/MainViewManager"),
               ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
               PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
               Dialogs = brackets.getModule("widgets/Dialogs"),
               FileViewController = brackets.getModule("project/FileViewController"),
               CommandManager = brackets.getModule("command/CommandManager"),
               FileUtils = brackets.getModule("file/FileUtils"),
               menuID = "avril.menu.clfofkg",
               Menus = brackets.getModule('command/Menus'),
               menu,
               contextMenu,
               itemMenuID_reopen,
               itemMenuID_Clear,
               itemMenuID_stop,
               itemMenuID_prefs,
               COMMAND_ID,
               idStorage,
               prefs,
               storageDATA,
               simpleGetDat,
               defaultArr,
               prefnumber,
               prefKey,
               objectK,
               timeN;

            function storageFn() {
               Dialogs.showModalDialog(COMMAND_ID, WStrings.NAME_EXTENSION, WStrings.titleNoSupport);
            }

            function hasDATA(n, h) {
               var tnu = n.indexOf(h);
               if (tnu > -1) {
                  return true;
               } else {
                  return false;
               }
            }

            function getNumItems() {
               var num_empty = "";
               var getNMB = prefs.get(prefnumber);
               var stringNMB = num_empty + getNMB;
               var returnNMB = parseInt(stringNMB, 10) || 5;
               if (returnNMB > 20) {
                  return 20;
               } else if (returnNMB < 5) {
                  return 5;
               } else {
                  return returnNMB;
               }
            }

            function getDATA(ar) {
               if (ar.length > 0) {
                  return ar.slice(-getNumItems());
               } else {
                  return [];
               }
            }

            function addCommandMenu(name, id, fn, pos, rel) {
               CommandManager.register(name, id, fn);
               menu.addMenuItem(id, "", pos, rel);
            }

            function getCommandId(id) {
               return CommandManager.get(id);
            }

            function alreadyRegistered(id) {
               if (typeof getCommandId(id) === "undefined") {
                  return false;
               } else {
                  return true;
               }
            }

            function getPath(pt) {
               var path = MainViewManager.getCurrentlyViewedPath(MainViewManager.ACTIVE_PANE);
               var registerCommand = COMMAND_ID + "_" + pt;
               return {
                  path: path,
                  registerCommand: registerCommand
               };
            }

            function getMenuIdItem(id) {
               var $getMenu = Menus.getMenuItem(menuID + "-" + id);
               if (typeof $getMenu === "undefined") {
                  return false;
               } else {
                  return true;
               }
            }

            function deleteMenu(id) {
               if (getMenuIdItem(id)) {
                  menu.removeMenuItem(id);
               }
            }

            function addMenu(id, pos) {
               menu.addMenuItem(id, "", pos);
            }

            function getCHECK(id) {
               if (CommandManager.get(id).getChecked()) {
                  return true;
               } else {
                  return false;
               }
            }

            function getENABLED(id) {
               if (CommandManager.get(id).getEnabled()) {
                  return true;
               } else {
                  return false;
               }
            }

            function removeInxs(y) {
               window.setTimeout(function () {
                  var currentPathTwo = MainViewManager.getCurrentlyViewedPath(MainViewManager.ACTIVE_PANE),
                     removeElemMenu = function (a, vmi) {
                        var indexA = a.indexOf(vmi);
                        if (indexA > -1) {
                           a.splice(indexA, 1);
                        }
                     };
                  if ((y === currentPathTwo) === false) {
                     removeElemMenu(simpleGetDat, y);
                     deleteMenu(getPath(y).registerCommand);
                  }
               }, 1000);
            }

            function fileOpenForEdit(pth) {
               removeInxs(pth);
               FileViewController.openAndSelectDocument(pth, FileViewController.PROJECT_MANAGER, MainViewManager.ACTIVE_PANE);
            }

            function reopen() {
               if (simpleGetDat.length > 0) {
                  fileOpenForEdit(simpleGetDat[simpleGetDat.length - 2]);
               }
            }

            function clearALLmenu() {
               $.each(simpleGetDat, function (n, v) {
                  deleteMenu(getPath(v).registerCommand);
               });
            }

            function addComOrMenu(va) {
               $.each(va, function (n, v) {
                  var $registerCommand = getPath(v).registerCommand;
                  if (!alreadyRegistered($registerCommand) && !getMenuIdItem($registerCommand)) {
                     addCommandMenu(v, $registerCommand, function () {
                        fileOpenForEdit(v);
                     }, Menus.FIRST);
                  } else if (alreadyRegistered($registerCommand) && !getMenuIdItem($registerCommand)) {
                     addMenu($registerCommand, Menus.FIRST);
                  }
               });
            }

            function everADD(t) {
               var anotherSimpleGetDat = getDATA(simpleGetDat);
               window.setTimeout(function () {
                  addComOrMenu(anotherSimpleGetDat);
               }, t);
            }

            function addORremove() {
               clearALLmenu();
               everADD(timeN);
            }

            function rewrite(ar, vl) {
               var f_index = ar.indexOf(vl);
               if (hasDATA(ar, vl)) {
                  if (ar[f_index] === vl) {
                     ar.splice(f_index, 1);
                  }
               }
            }

            function exclude() {
               var path = getPath().path,
                  sPath = FileUtils.getBaseName(path),
                  aPath = path.substring(path.lastIndexOf("/") + 1),
                  dPath = sPath || aPath,
                  obk = prefs.get(objectK),
                  internal = /_brackets_/i,
                  iin,
                  booex;
               for (iin in obk) {
                  if (obk.hasOwnProperty(iin)) {
                     var uPath = new RegExp(obk[iin], "i").test(dPath),
                        iPath = internal.test(path);
                     if (uPath || iPath) {
                        booex = true;
                     } else {
                        booex = false;
                     }
                  }
               }
               return booex;
            }

            function addButton() {
               var $path = getPath().path;
               if ($path || typeof $path === "string") {
                  rewrite(simpleGetDat, $path);
                  if (!hasDATA(simpleGetDat, $path) && !exclude()) {
                     simpleGetDat.push($path);
                     localStorage.setItem(idStorage, JSON.stringify(getDATA(simpleGetDat)));
                  }
                  addORremove();
               }
            }

            function disable(el, boo, ar) {
               if (boo && getENABLED(el) && ar.length === 0) {
                  CommandManager.get(el).setEnabled(!boo);
               }
               if (!boo && !(getENABLED(el)) && ar.length > 0) {
                  CommandManager.get(el).setEnabled(true);
               }
            }

            function clearDATA() {
               clearALLmenu();
               while (simpleGetDat.length > 0) {
                  simpleGetDat.pop();
               }
               localStorage.removeItem(idStorage);
               disable(itemMenuID_Clear, true, simpleGetDat);
               disable(itemMenuID_reopen, true, simpleGetDat);
            }

            function noSaveToRestar() {
               if (getCHECK(itemMenuID_stop)) {
                  CommandManager.get(itemMenuID_stop).setChecked(false);
               } else {
                  CommandManager.get(itemMenuID_stop).setChecked(true);
               }
            }

            function setPrefs(k, b) {
               prefs.set(k, b);
               prefs.save();
            }

            function addItemsNum() {
               if (!prefs.get(prefnumber)) {
                  setPrefs(prefnumber, 5);
               }
            }

            function addObject() {
               if (!prefs.get(objectK)) {
                  setPrefs(objectK, defaultArr);
               }
            }

            function arraysIdentical(a, b) {
               var i = a.length;
               if (i !== b.length) {
                  return false;
               }
               while (i--) {
                  if (a[i] !== b[i]) {
                     return false;
                  }
               }
               return true;
            }

            function addNewObject(a, b) {
               if (!(arraysIdentical(a, b))) {
                  setPrefs(objectK, b);
               }
            }

            function setFormValues() {
               $(".RECENTSMANAGER input[type=number]").val(getNumItems());
               $(".RECENTSMANAGER input[type=checkbox]").eq(0).prop("checked", prefs.get(prefKey));
               var getObk = JSON.stringify(prefs.get(objectK)).replace(/\[|\]|\"/g, "").replace(/,/g, ", ");
               $(".RECENTSMANAGER .cntntEditable").val(getObk);
            }

            function prefsStore() {
               var compiledTemplate = Mustache.render(settingsDialogTemplate, WStrings);
               var dialog = Dialogs.showModalDialogUsingTemplate(compiledTemplate, true);
               setFormValues();
               dialog.done(function (i) {
                  var $dialog = dialog.getElement();
                  var setn = $dialog.find("input[type=number]").val();
                  var chip = $dialog.find("input[type=checkbox]").eq(0).prop("checked");
                  var textob = $dialog.find(".RECENTSMANAGER .cntntEditable").val();
                  var arrEmSpc = textob.replace(/[^a-z0-9|\-|,]+/gi, "").replace(/,$/, "");
                  var addBra = '["' + arrEmSpc.replace(/,/g, '","') + '"]';
                  var objarr = JSON.parse(addBra);
                  var endArr = objarr.filter(function (e) {
                     return e;
                  });
                  if (i === "ok") {
                     setPrefs(prefnumber, parseInt(setn, 10));
                     setPrefs(prefKey, chip);
                     addNewObject(prefs.get(objectK), endArr);
                  } else if (i === "defaults") {
                     setPrefs(prefnumber, 5);
                     setPrefs(prefKey, false);
                     addNewObject(prefs.get(objectK), defaultArr);
                  }
               });
            }

            function addImportantsMenus() {
               addCommandMenu(WStrings.titleREOPEN, itemMenuID_reopen, reopen, Menus.BEFORE);
               contextMenu.addMenuItem(itemMenuID_reopen, "", Menus.FIRST);
               addCommandMenu(WStrings.titleCLEAR, itemMenuID_Clear, clearDATA, Menus.AFTER, itemMenuID_reopen);
               menu.addMenuDivider(Menus.BEFORE, itemMenuID_Clear);
               addCommandMenu(WStrings.titleRESET, itemMenuID_stop, noSaveToRestar, Menus.AFTER, itemMenuID_Clear);
               addCommandMenu(WStrings.titlePREFS, itemMenuID_prefs, prefsStore, Menus.AFTER, itemMenuID_stop);
            }

            function there() {
               addButton();
               disable(itemMenuID_Clear, false, simpleGetDat);
               disable(itemMenuID_reopen, false, simpleGetDat);
            }

            function onWorking() {
               setPrefs(prefKey, !!prefs.get(prefKey));
               addImportantsMenus();
               MainViewManager.on("currentFileChange", function () {
                  if (!prefs.get(prefKey) && !(getCHECK(itemMenuID_stop))) {
                     there();
                  }
               }).on("workingSetAdd", function () {
                  if (prefs.get(prefKey) && !(getCHECK(itemMenuID_stop))) {
                     there();
                  }
               });
            }

            function stayADD() {
               everADD(timeN);
            }

            function stay() {
               if (!localStorage) {
                  storageFn();
               } else {
                  addItemsNum();
                  addObject();
                  stayADD();
                  onWorking();
                  disable(itemMenuID_Clear, true, simpleGetDat);
                  disable(itemMenuID_reopen, true, simpleGetDat);
               }
            }
            AppInit.appReady(function() {
               if (Menus.getMenu("avril.menu.clfofkg") !== undefined) {
                  return;
               }
               menu = Menus.addMenu(WStrings.menuNAME, menuID, Menus.AFTER, Menus.AppMenuBar.NAVIGATE_MENU);
               contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU);
               itemMenuID_reopen = "avril.menu.item.reopen";
               itemMenuID_Clear = "avril.menu.item.clearAll";
               itemMenuID_stop = "avril.menu.item.stop";
               itemMenuID_prefs = "avril.menu.item.prefs";
               COMMAND_ID = "drs42kisqLyPgUvk";
               idStorage = COMMAND_ID + "data";
               prefs = PreferencesManager.getExtensionPrefs("avril.history");
               storageDATA = localStorage.getItem(idStorage);
               simpleGetDat = storageDATA ? JSON.parse(storageDATA) : [];
               defaultArr = ["thumb", "thumbnails"];
               prefnumber = "items";
               prefKey = 'inWorking';
               objectK = "excludeItems";
               timeN = 500;
               ExtensionUtils.loadStyleSheet(module, "style.min.css"); 
               stay();
            });
         });
   }   
}());
