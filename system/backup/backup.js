define(function (require, exports, module) {
    "use strict";
    var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs = PF.getExtensionPrefs("brackets-website-admin");
   if(prefs.get("backup") == undefined || prefs.get("backup") === false){
      return false;
   }    
    /* === LOAD BRACKET MODULES === */
    var CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        AppInit         = brackets.getModule("utils/AppInit"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        Preferences     = require("./preferences");

        /*
        File            = brackets.getModule("filesystem/File"),
        FileSystem      = brackets.getModule("filesystem/FileSystem"),
        FileUtils       = brackets.getModule("file/FileUtils");
        */
    

    /* === MAIN VARIABLES === */
    var menu,
        CREATE_FILE_BACKUP,
        START_AUTO_BACKUP,
        STOP_AUTO_BACKUP,
        SET_AUTO_BACKUP_TIME,
        backupInterval = 'undefined',
        msInMins = 60000,
        timeInMins = 3,
        backupTime = 180000,
        suppliedTime = 3,
        timeInputElem,
        prefObj,
        isAutoBackup = false;


    /* === MAIN FUNCTIONS ===  */
    function createFileBackup() {
        //console.log('createFileBackup()');
        
        //Clear auto backup job
        if(isAutoBackup) clearInterval(backupInterval);
        
        //Get the current document
        var currDoc = DocumentManager.getCurrentDocument();
        
        //console.log(currDoc);
        if(typeof currDoc != 'undefined' && currDoc != null) {
            var currDocTxt = currDoc.getText();
            var currDocFile = currDoc.file;

            //Blind save the orig file first
            var options = {};
            options.blind = true;
            currDocFile.write(currDocTxt, options);

            //Change path and set file variables

            var d = new Date();
            var n = d.toJSON().replace(/T(.*?)Z/,'[$1]').replace(/:/g, '-');
            var currDocOrigPath = currDoc.file._path;
            var currDocBakPath = currDocOrigPath + '~' + n;
           //console.log(currDocBakPath);
            // currDocOrigPath+'.bak';

            //Change doc path to bak
            currDoc.file._path = currDocBakPath;

            //Create/write the backup file
            currDocFile.write(currDocTxt, options);

            //Change doc path to orig
            currDoc.file._path = currDocOrigPath;
        }
        
        //Restart the auto backup, if enabled
        if(isAutoBackup) startAutoBackup();
        
    } //end of createFileBackup()
    

    function startAutoBackup() {
        //console.log('startAutoBackup()');
        if(!isAutoBackup) {
            menu.removeMenuItem(START_AUTO_BACKUP);
            menu.removeMenuItem(SET_AUTO_BACKUP_TIME);
            menu.addMenuItem(STOP_AUTO_BACKUP);
            isAutoBackup = true;
        }
        clearInterval(backupInterval);
        backupInterval = window.setInterval(function() {
            //console.log('[autoBackup]');
            createFileBackup();
        }, backupTime);
    }
    
    function stopAutoBackup() {
        menu.addMenuItem(START_AUTO_BACKUP);
        menu.addMenuItem(SET_AUTO_BACKUP_TIME);
        menu.removeMenuItem(STOP_AUTO_BACKUP);
        isAutoBackup = false
        //console.log('stopAutoBackup()');
        clearInterval(backupInterval);
    }
    
    function dummyFunction() {
        //console.log('dummyFunction()');
    }

    
    function updateAutoBackupTime() {
        //console.log('updateAutoBackupTime()');
        backupTime = parseInt(timeInMins) * msInMins /*300000 MS = 5 mins., 180000 MS = 3mins.*/;
    }

    
    function setAutoBackupTime() {
        //console.log('setAutoBackupTime()');
        var btnArr = [
            { className: 'DIALOG_BTN_CLASS_PRIMARY', id: 'DIALOG_BTN_OK', text: 'OK' },
        ]

        var dialog = Dialogs.showModalDialog(
            "backupTimerSettings",
            "Backup - Set Auto Backup Time",

            '<label class="label-time">Time in minutes (minimum is 1): </label>'+
            '<input type="text" name="min-time" id="min-time" value="'+ timeInMins +'"/>',
    
            btnArr
        );
        timeInputElem = document.querySelector("#min-time");

        //dialog.done() example was seen in brackets-snippets
        dialog.done(function (buttonId) {
            if(buttonId === "DIALOG_BTN_OK") {
                suppliedTime = parseInt(timeInputElem.value);
                if(suppliedTime >= 1) timeInMins = suppliedTime;
                else timeInMins = 1;
                Preferences.set('autoBackupTime', timeInMins)
                updateAutoBackupTime();
            }
        });

    }


    /* === APP INIT === */
    AppInit.appReady(function () {
        /* === REGISTER COMMANDS === */
       $g.backup = {};
        CREATE_FILE_BACKUP = "brackets-website-admin.createFileBackup";
        CommandManager.register("Backup - CREATE", CREATE_FILE_BACKUP, createFileBackup);
        $g.backup.create = CREATE_FILE_BACKUP; 

        START_AUTO_BACKUP = "brackets-website-admin.startAutoFileBackup";
        CommandManager.register("Backup - START Auto", START_AUTO_BACKUP, startAutoBackup);
        $g.backup.start = START_AUTO_BACKUP; 

        STOP_AUTO_BACKUP = "brackets-website-admin.stopAutoBackup";
        CommandManager.register("Backup - STOP Auto", STOP_AUTO_BACKUP, stopAutoBackup);
        $g.backup.stop = STOP_AUTO_BACKUP; 
       
        SET_AUTO_BACKUP_TIME = "brackets-website-admin.dummyFunction";
        CommandManager.register("Backup - SET Auto Backup TIME", SET_AUTO_BACKUP_TIME, setAutoBackupTime);
        $g.backup.interval = SET_AUTO_BACKUP_TIME; 

       

      
       
        //var DUMMY_FUNCTION = "bracketsBackup.dummyFunction";
        //CommandManager.register("Backup - Dummy Function", DUMMY_FUNCTION, dummyFunction);


        /* === CREATE MENU ITEM === */
        /*
        menu = Menus.addMenu("Backup", 'Backup', Menus.AFTER, Menus.AppMenuBar.FILE_MENU);
        menu.addMenuItem(CREATE_FILE_BACKUP);
        menu.addMenuItem(START_AUTO_BACKUP);
        menu.addMenuItem(SET_AUTO_BACKUP_TIME);
        */


        //Load the CSS
        ExtensionUtils.loadStyleSheet(module, "./main.css");

        //Get the existing preferences
        prefObj = Preferences.getAll();
        timeInMins = prefObj.autoBackupTime;


        //Update the auto backup time
        updateAutoBackupTime();

    });
    
    
});
