/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999

*/
/*global $, CryptoJS, Node, EJS, define, localStorage, Mustache, brackets, debugger, window, console, WebSocket

 */  
(function () {
   "use strict";
      var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs_ = PF.getExtensionPrefs("brackets-website-admin");
   if(prefs_.get("cursor") == undefined || prefs_.get("cursor") === false){
      return false;
   }  

   var
      template = '<div class="theme-settings modal">' +
      '     <div class="modal-header">' +
      '        <a href="#" class="close" data-dismiss="modal">×</a>' +
      '        <h1 class="dialog-title"><a class="_spinner _iL fa fa-mouse-pointer"></a> Cursor Settings</h1>' +
      '    </div>' +
      '    <div class="modal-body">' +
      '        <form class="form-horizontal">' +
      '            <div class="control-group">' +
      '                <label class="control-label">Style:</label>' +
      '                <div class="controls">' +
      '                    <select id="cursorStyle" name="cursorStyle">' +
      '                        <option style="text-align:left;" value="vertical">vertical</option>' +
      '                        <option style="text-align:left;" value="horizontal">horizontal</option>' +
      '                        <option style="text-align:left;" value="block">block</option>' +
      '                    </select>' +
      '                </div>' +
      '            </div>' +
      '            <div class="control-group">' +
      '                <label class="control-label">Color:</label>' +
      '                <div class="controls">' +
      '                    <input type="text" id="cursorColor" name="cursorColor" value="">' +
      '                </div>' +
      '                <div class="controls">' +
      '                    <p>' +
      '                        ex. blue, #0000ff, rgba(0, 0, 255, 1), etc.' +
      '                    </p>' +
      '                </div>' +
      '            </div>' +
      '            <div class="control-group" id="textColorGroup">' +
      '                <label class="control-label">Text Color:</label>' +
      '                <div class="controls">' +
      '                    <input type="text" id="textColor" name="textColor" value="">' +
      '                </div>' +
      '                <div class="controls">' +
      '                    <p>' +
      '                        The color of the character in the block style cursor.' +
      '                        <br>' +
      '                        ex. blue, #0000ff, rgba(0, 0, 255, 1), etc.' +
      '                    </p>' +
      '                </div>' +
      '            </div>' +
      '            <div class="control-group">' +
      '                <label class="control-label">Blink Rate:</label>' +
      '                <div class="controls">' +
      '                    <input type="text" id="blinkRate" name="blinkRate" value="">' +
      '                </div>' +
      '                <div class="controls">' +
      '                    <p>' +
      '                        In milliseconds.  Enter 0 for a non-blinking cursor.' +
      '                    </p>' +
      '                </div>' +
      '            </div>' +
      '        </form>' +
      '    </div>' +
      '    <div class="modal-footer">' +
      '        <button class="dialog-button btn" data-button-id="cancel">Close</button>' +
      '        <button class="dialog-button btn primary" data-button-id="done">OK</button>' +
      '    </div>' +
      '</div>',
      AppInit = brackets.getModule("utils/AppInit"),
      WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
      MainViewManager = brackets.getModule("view/MainViewManager"),
      EditorManager = brackets.getModule("editor/EditorManager"),
      Editor = brackets.getModule("editor/Editor"),
      ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
      CommandManager = brackets.getModule("command/CommandManager"),
      Menus = brackets.getModule("command/Menus"),
      Dialogs = brackets.getModule("widgets/Dialogs"),
      PreferencesManager = brackets.getModule("preferences/PreferencesManager"),
      Strings = brackets.getModule("strings"),
      prefs = PreferencesManager.getExtensionPrefs("brackets-website-admin.cursor"),
      commandId = "brackets-website-admin.cursor.openSettings",
      editors = [],
      cssNode = null,
      viewMenu,
      viewMenuCommands,
      currentEditor = EditorManager.getCurrentFullEditor(),
      addChar = false,
      $template = Mustache.to_html(template, {});
      
      /*new EJS({
            text: require("text!html/cursor-settings.html")
         }).render(finalObj), false);*/
     

   // NOTE: access to ._codeMirror may disappear in future releases of Brackets
   // discussion here:
   // https://github.com/adobe/brackets/issues/8751
   // without access to the codeMirror object, this extension will break

   function refreshCursorOptions(editor) {
      var
         width = editor._codeMirror.defaultCharWidth(),
         cursorStyle = prefs.get("cursorStyle"),
         cursorColor = prefs.get("cursorColor"),
         textColor = prefs.get("textColor"),
         blinkRate = prefs.get("blinkRate"),
         css;

      addChar = cursorStyle === 'block';

      if (cursorStyle === 'block') {
         css = "#editor-holder .CodeMirror-cursor {border-left: none !important;width: " + width + "px !important;background-color: " + cursorColor + " !important;color: " + textColor + " !important;}";
      } else if (cursorStyle === 'horizontal') {
         css = "#editor-holder .CodeMirror-cursor {border-left: none !important;width: " + width + "px !important;border-bottom: 1px solid " + cursorColor + " !important;}";
      } else if (cursorStyle === 'vertical') {
         css = "#editor-holder .CodeMirror-cursor {width: " + width + "px !important;border-left: 1px solid " + cursorColor + " !important;}";
      }

      if (cssNode) {
         cssNode.parentNode.removeChild(cssNode);
      }
      cssNode = ExtensionUtils.addEmbeddedStyleSheet(css);

      if (blinkRate || blinkRate === 0) {
         editor._codeMirror.setOption('cursorBlinkRate', blinkRate);
      }

   }

   function showDialog() {
      var
         d = Dialogs.showModalDialogUsingTemplate($template, true),
         dialog = d.getElement(),
         cursor = $('.CodeMirror-cursor'),
         currentColor = cursor.css('border-left-color'),
         currentBlinkRate;

      function ghostTextColorGroup() {
         if (dialog.find('#cursorStyle').val() === 'block') {
            dialog.find('#textColorGroup').css({
               opacity: '1'
            }).find('input').attr('disabled', false);
         } else {
            dialog.find('#textColorGroup').css({
               opacity: '.3'
            }).find('input').attr('disabled', true);
         }
      }

      if (currentEditor) {
         currentBlinkRate = currentEditor._codeMirror.getOption('cursorBlinkRate');
      } else {
         currentBlinkRate = 530;
      }

      dialog.find('#cursorStyle').val(prefs.get("cursorStyle") || 'vertical');
      dialog.find('#cursorColor').val(prefs.get("cursorColor") || currentColor);
      dialog.find('#textColor').val(prefs.get("textColor") || 'transparent');
      dialog.find('#blinkRate').val(prefs.get("blinkRate") || currentBlinkRate);
      dialog.find('#cursorStyle').change(ghostTextColorGroup);

      ghostTextColorGroup();

      d.done(function (buttonId) {
         var
            blinkRate;
         if (buttonId === 'done') {
            prefs.set("cursorStyle", dialog.find('#cursorStyle').val());
            prefs.set("cursorColor", dialog.find('#cursorColor').val());
            prefs.set("textColor", dialog.find('#textColor').val());
            blinkRate = parseInt(dialog.find('#blinkRate').val(), 10) || 0;
            if (blinkRate < 0) {
               blinkRate = 0;
            }
            prefs.set("blinkRate", blinkRate);
            prefs.save();
            refreshCursorOptions(currentEditor);
         }
         currentEditor = EditorManager.getCurrentFullEditor();
         if (currentEditor) {
            currentEditor._codeMirror.refresh();
         }
      });
   }

   function updateCursor(editor) {
      setTimeout(function () {
         // CodeMirror continually empties the cursor div on any activity
         // so we update on the next tick.
         var
            document = editor.document,
            selections = editor.getSelections(),
            cursorElements = window.document.getElementsByClassName("CodeMirror-cursor"),
            chars = [],
            cursors = [],
            i;
         selections.forEach(function (selection) {
            var startPos = selection.start;
            var endPos = {
               line: startPos.line,
               ch: startPos.ch + 1
            };
            chars.push(document.getRange(startPos, endPos));
         });
         for (i = cursorElements.length - 1; i >= 0; i--) {
            cursors.push(cursorElements[i]);
         }
         cursors.sort(function (c1, c2) {
            // ensure that the right chars go into the right cursors
            var $c1 = $(c1);
            var $c2 = $(c2);
            if ($c1.offset().top < $c2.offset().top && $c1.offset().left < $c2.offset().left) {
               return -1;
            } else {
               return 1;
            }
         });
         if (addChar) {
            cursors.forEach(function (cursor, i) {
               if (chars[i]) {
                  cursor.innerHTML = chars[i];
               }
            });
         }
      }, 1);
   }

   function cursorActivityHandler(event) {
      var
         editor = event.target;
      updateCursor(editor);
   }

   function registerEditor(editor) {
      var
         $editor = editor;
      // CodeMirror will refill it.  We need to
      // empty it so ...
      $('.CodeMirror-cursors').empty();

      if (editors.indexOf(editor) === -1) {
         editors.push(editor);
         $editor.on("cursorActivity", cursorActivityHandler);
         $editor.on("scroll", cursorActivityHandler);
         // without a refresh, cursor will be hidden when switching
         // back to a previously active editor
         editor._codeMirror.refresh();
      }
   }

   function unregisterEditor(editor) {
      var i;
      var $editor = editor;
      for (i = editors.length - 1; i >= 0; i--) {
         if (editors[i] === editor) {
            editors.splice(i, 1);
         }
      }
      $editor.off("cursorActivity", cursorActivityHandler);
      $editor.off("scroll", cursorActivityHandler);
   }

   function viewUpdateHandler() {
      var
         id;
      for (id in editors) {
         if (editors.hasOwnProperty(id)) {
            updateCursor(editors[id]);
         }
      }
   }

   function activeEditorChangedHandler(event, focusedEditor, lostEditor) {
      if (lostEditor) {
         unregisterEditor(lostEditor);
      }
      if (focusedEditor) {
         currentEditor = focusedEditor;
         registerEditor(focusedEditor);
         refreshCursorOptions(focusedEditor);
         updateCursor(focusedEditor);
      }
   }

   if (currentEditor) {
      registerEditor(currentEditor);
   }

   CommandManager.register("Cursor...", commandId, showDialog);
   $g.cursor = commandId;

   AppInit.appReady(function () {
      WorkspaceManager.on('workspaceUpdateLayout', viewUpdateHandler);
      MainViewManager.on('activePaneChange', viewUpdateHandler);
      EditorManager.on('activeEditorChange', activeEditorChangedHandler);
   });
}());