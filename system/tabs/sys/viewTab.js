/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 3, maxerr: 999 */
/*global $, Node, EJS, define, Mustache, brackets, debugger, window, console, eval */
define(function (e, t, n) {
   "use strict";
   var
      PF = brackets.getModule("preferences/PreferencesManager"),
      prefs = PF.getExtensionPrefs("brackets-website-admin");
   if(prefs.get("tabs") === undefined || prefs.get("tabs") === false){
      return false;
   }   
   
   
    var
      scrollHandle = 0,
      scrollStep = 5,
      scrollTo ;

   function setThePosition(){
      var
         _l1 = $('#sidebar:visible').length ? $('#sidebar').width()  : 0,
         _l2 = $('#main-toolbar:visible').length ? $('#main-toolbar').width()  : 0,
         _t = _l1 + _l2;
      if(_l1 >0 || _l2 >0){
         _t+= 2;
      }
      return (_t);
   }

   function ie(e, t) {
      H.set(e, t);
      H.save();
   }

   function ae(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
   }

   function re(e) {
      return e.hasOwnProperty("type") && "contextmenu" === e.type ? $(e.currentTarget).hasClass("sys-tabs-ul-list-view") ? I.getWorkingSet($(e.currentTarget).data(u))[$(e.target).closest("li").not(".sys-tabs-null-element").index()] : $(e.target).closest("li").data(f) : e.parent().hasClass("sys-tabs-ul-list-view") ? I.getWorkingSet(e.parent().data(u))[e.not(".sys-tabs-null-element").index()] : e.data(f);
   }

   function le(e, t) {
      return {
         file: t ? e.file : re(e),
         pane: t ? e.pane : I._getPaneIdForPath(re(e).fullPath)
      }
   }

   function oe(e, t) {
      R.setFileViewFocus(R.WORKING_SET_VIEW), O.execute(U.FILE_OPEN, {
         fullPath: le(e, t).file.fullPath,
         paneId: le(e, t).pane
      }).always(function () {
         I.focusActivePane();
      }).done(function(){
         $('#sys-tabs-first-pane-list-View').remove();
      });
   }

   function se() {
      I.focusActivePane()
   }

   function ce(e) {
      O.execute(U.FILE_CLOSE, {
         file: re(e),
         paneId: le(e).pane
      }).always(function () {
         se()
      })
   }

   function de() {
      return !1
   }

   function fe() {
      return $(a.createElement("li")).addClass("sys-tabs-prepare-placeholder sys-tabs-null-element").html("&nbsp;")
   }

   function ke(e, t, n, i) {
      t = $("#" + t).data(u), i = $("#" + i).data(u), I._moveView(t, i, e, n).always(function () {
         O.execute(U.FILE_OPEN, {
            fullPath: e.fullPath,
            paneId: i
         }).always(function () {
            se()
         })
      })
   }

   function ye(e, t, n) {
      I._moveWorkingSetItem($("#" + t).data(u), e, n), se()
   }

   function Pe(e) {
      $(".sys-tabs-null-element").remove(), e.show()
   }

   function Ce() {
      H.get(K) && w && w.is(":visible") && w.hide()
   }

   function Me(e) {
      "dragstart" === e.type ? (ve = !0, Ce(), ge = (ue = $(e.currentTarget)).addClass("sys-tabs-sortable-dragging").index(), he = $(e.currentTarget).width(), pe = $(e.currentTarget).data(f), we = $(e.currentTarget).html(), me = $(e.currentTarget).parent().attr("id"), e.originalEvent.dataTransfer.setData("Text", $(e.currentTarget).data(f).fullPath)) : "dragend" === e.type && ($e || ve) && (Pe(ue), ue = void 0, ve = void 0)
   }

   function xe(e) {
      if (void 0 === ue) return !1;
      if ("dragover" === e.type) {
         if (e.preventDefault(), Te = e.currentTarget.id, $(e.target).is("li") || !$("#" + Te).find("li").length) {
            $("#" + Te).find(".sys-tabs-prepare-placeholder").length || fe().prependTo($("#" + Te)), Ee.width(he), Ee.height(""), Ee.html(we), ue.hide(), $(e.target).after(Ee);
            var t = $(e.currentTarget).children("li:not(.sys-tabs-prepare-placeholder):not(.sys-tabs-sortable-dragging)");
            $(e.target).hasClass("sys-tabs-sortable-placeholder") || (be = t.index(Ee))
         }
         $("#" + Te).find("em").length && $("#" + Te).find("em").hide()
      } else if ("drop" === e.type) return e.stopPropagation(), ve = !1, $e = !1, me !== Te ? ke(pe, me, be, Te) : ge !== be ? ye(ge, me, be) : $e = !0, !1
   }

   function Se(e) {
      $(e.currentTarget).find("li").length && ($(e.target).is("ul") || $(e.target).closest("li").hasClass("selected") || oe(e), i.setTimeout(function () {
         te.open(e)
      }, 12))
   }

   function Ve(e) {
      if (e.preventDefault(), e = window.event || e, $(e.currentTarget).children().length && $(e.currentTarget)[0].scrollWidth > $(e.currentTarget).parent().width()) {
         var t = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail)),
            n = $(e.currentTarget).data("scrollwheel"),
            i = 0 > t ? J + n : n - J,
            a = $(e.currentTarget)[0].scrollWidth - $(e.currentTarget).parent().width(),
            r = i > a ? a : 0 > i ? 0 : i;
         $(e.currentTarget).data("scrollwheel", r), $(e.currentTarget).scrollLeft($(e.currentTarget).data("scrollwheel"))
      }
   }

    //Actual handling of the scrolling
    function startScrolling(modifier, step) {
        if (scrollHandle === 0) {
            scrollHandle = setInterval(function () {
                var newOffset = $('.sys-tabs-navbar').scrollLeft() + (scrollStep * modifier);

                $('.sys-tabs-navbar').scrollLeft(newOffset);
            }, 10);
        }
    }

    function stopScrolling() {
        clearInterval(scrollHandle);
        scrollHandle = 0;
    }

   function Ie() {
      v = $(a.createElement("div")).attr({
         id: "sys-tabs-first-tabbar",
         "class": "sys-tabs-tabbar sys-tabs-height no-focus"
      }).on("selectstart", de).on("contextmenu", ae).on("mouseleave", Ce).prependTo(m);
      v.append('<a id="panLeft" class="panner btn fa fa-caret-left" data-scroll-modifier="-1"></a><a id="panRight" class="panner btn fa fa-caret-right" data-scroll-modifier="1"></a>');
       //Start the scrolling process
       $(".panner").on("mousedown", function () {
           var data = $(this).data('scrollModifier'),
               direction = parseInt(data, 10);

           $(this).addClass('active');

           startScrolling(direction, scrollStep);
       });

       //Kill the scrolling
       $(".panner").on("mouseup", function () {
           stopScrolling();
           $(this).removeClass('active');
       });
   }


   function _e() {
      h.appendTo(v), b.css("right", 58), E.css("right", 30), P.css("right", 28), M.css("right", 0)
   }

   function Le() {
      h.appendTo(y), b.css("right", 28), E.css("right", 0), P.css("right", 58), M.css("right", 30)
   }

   function We() {
      var e, t = ["splitview-icon-none", "splitview-icon-vertical", "splitview-icon-horizontal"],
         n = I.getLayoutScheme();
      n.columns > 1 ? (e = 1, Le()) : n.rows > 1 ? (e = 2, _e()) : (e = 0, _e()), p.removeClass(t.join(" ")).addClass(t[e])
   }

   function De() {
      g.html("←").attr("title", V.CMD_HIDE_SIDEBAR).addClass("sys-tabs-toggle-open")
   }

   function Ne() {
      g.html("→").attr("title", V.CMD_SHOW_SIDEBAR).removeClass("sys-tabs-toggle-open")
   }

   function Ae(e) {
      r.is(":visible") ? De() : Ne()
   }

   function ze() {
      g = $(a.createElement("div")).attr("class", "sys-tabs-toggle-sidebar btn-alt-quiet").on("click", function () {
         A.toggle(r)
      }).appendTo(v), Ae()
   }

   function Re() {
      p = $(a.createElement("div")).attr({
         "class": "working-set-splitview-btn btn-alt-quiet",
         title: V.SPLITVIEW_MENU_TOOLTIP
      }).on("click", function (e) {
         e.stopImmediatePropagation(), S = !S, S ? ee.open(e) : ee.close(), S = !S
      }).appendTo(v)
   }

   function Oe() {
      b = $(a.createElement("nav")).attr({
         id: "sys-tabs-first-navbar",
         "class": "sys-tabs-navbar sys-tabs-first-navbar focused-tabbar sys-tabs-height"
      }).appendTo(v)
   }

   function Fe() {
      T = $(a.createElement("ul")).attr({
         id: "sys-tabs-first-nav-ul",
         "class": "sys-tabs-nav-ul sys-tabs-height"
      }).data("scrollwheel", 15).data(u, c).on("contextmenu.workingSetView", Se).on("drop dragover dragenter", xe).on("mousewheel", Ve).html(V.EMPTY_VIEW_HEADER).appendTo(b)
   }

   function Ue() {
      y = $(a.createElement("div")).attr({
         id: "sys-tabs-second-tabbar",
         "class": "sys-tabs-tabbar sys-tabs-height no-focus"
      }).on("selectstart", de).on("contextmenu", ae).on("mouseleave", Ce).prependTo(k)
   }

   function Be() {
      P = $(a.createElement("nav")).attr({
         id: "sys-tabs-second-navbar",
         "class": "sys-tabs-navbar sys-tabs-second-navbar sys-tabs-height"
      }).appendTo(y)
   }

   function He() {
      C = $(a.createElement("ul")).attr({
         id: "sys-tabs-second-nav-ul",
         "class": "sys-tabs-nav-ul sys-tabs-height"
      }).data("scrollwheel", 15).data(u, d).on("contextmenu.workingSetView", Se).on("drop dragover", xe).on("mousewheel", Ve).html(V.EMPTY_VIEW_HEADER).appendTo(P)
   }

   function qe() {
      var t, n, i, a, _l, e = H.get(q);
      e ? (t = "0px", n = "«", i = "#37b1ac", a = "Hide toolBar", _l ="31px") : (t = "0", n = "»", i = "", a = "Show toolBar", _l = "0px"), l.toggle(e), o.css({"right": t, "margin-left": _l}), h.html(n).attr("title", a).css("color", i);
      $('.sys-tabs-box-list-view').css({'left': setThePosition() + 'px'});
   }

//o = $(".main-view .content")


   function je() {
      h = $(a.createElement("div")).attr("class", "sys-tabs-toggle-toolbar btn-alt-quiet").click(function () {
         ie(q, !H.get(q))
      }).appendTo(v)
   }

   function Ke(e) {
      return $("<div class='sys-tabs-file-status-icon can-close'></div>").mousedown(function (e) {
         e.preventDefault()
      }).on("click", function (e) {
         e.stopPropagation(), ce($(this).parent())
      }).appendTo(e)
   }

   function Xe(e, t) {
      H.get(K) && "object" == typeof e.data(f) && (w.find(".sys-tabs-parentPath").html(e.data(f)._parentPath), w.find(".sys-tabs-language").html("Language Id : " + D.getLanguageForPath(e.data(f).fullPath).getId()), e.data(f).stat(function (e, t) {
         void 0 !== t && (w.find(".sys-tabs-date").html("<br>" + t.mtime), w.find(".sys-tabs-size").html(W.prettyPrintBytes(t.size.valueOf())), w.find(".sys-tabs-hash").html("<br>hash : " + t._hash))
      }), z.readAsText(e.data(f)).done(function (e) {
         w.find(".sys-tabs-charcount").html(e.length + " Chars"), w.find(".sys-tabs-lines").html(W.format(V.STATUSBAR_LINE_COUNT_PLURAL, W.getLines(e).length)), w.find(".sys-tabs-lineEnding").html("line ending : " + z.sniffLineEndings(e))
      }), w.show())
   }

   function Ye(e, t) {
      if (!H.get(K)) return !1;
      if (w.is(":visible")) {
         var n = function () {
            var e = t.currentTarget.clientHeight + 14,
               n = t.currentTarget.parentNode.parentNode.parentNode.parentNode.offsetTop,
               i = a.getElementById("editor-holder").offsetTop,
               r = n + i,
               l = r + e + w.outerHeight(!0),
               o = t.pageX - w.outerWidth(!0) / 2,
               s = t.pageX + w.outerWidth(!0) / 2;
            return {
               maxTop: l,
               top: r - (w.outerHeight(!0) + 14),
               bottom: r + e,
               left: o,
               right: s,
               width: a.body.clientWidth,
               height: e
            }
         };
         n().maxTop > a.body.clientHeight ? (w.css("top", n().top), L.toggleClass(w.find(".sys-tabs-arrow"), "sys-tabs-arrow-bottom", "sys-tabs-arrow-top")) : (w.css("top", n().bottom), w.find(".sys-tabs-arrow").removeClass("sys-tabs-arrow-top"), w.find(".sys-tabs-arrow").addClass("sys-tabs-arrow-bottom")), w.find(".sys-tabs-arrow").css("left", t.pageX - w.offset().left), n().left < n().width && n().right > n().width ? w.css({
            right: 9,
            left: ""
         }) : n().left < 0 && n().right < n().width ? w.css({
            right: "",
            left: 9
         }) : w.css({
            right: "",
            left: n().left
         })
      }
   }

   function Ge(e) {
      var t = $(e.currentTarget),
         n = t.find(".sys-tabs-file-status-icon.can-close"),
         i = t.find(".sys-tabs-file-status-icon.dirty");
      "click" === e.type ? t.hasClass("selected") || oe($(e.currentTarget)) : "mouseenter" === e.type ? (i.length && (t.data("file-is-dirty", !0), i.remove()), Ke(t), Xe(t, e)) : "mousemove" === e.type ? Ye(t, e) : "mouseleave" === e.type && (t.data("file-is-dirty") ? (n.removeClass("can-close"), n.addClass("dirty"), n.removeData("file-is-dirty")) : n.remove(), Ce());
      if (e.type === "click") {
         $('#sys-tabs-first-pane-list-View').remove();
      }
   }

   function Je(e) {
      var
         t = I.findInWorkingSet(e, I.getCurrentlyViewedPath(e));
      if(t === -1){
         return;
      }
      if($('#sys-tabs-first-nav-ul>li:eq(' + t + ')').position() === undefined){
         t = $('#sys-tabs-first-nav-ul>li').length - 1;
      }
      
         try{scrollTo = $('#sys-tabs-first-nav-ul>li:eq(' + t + ')').position().left;}
      catch(e){}
         //scrollTo = $('#sys-tabs-first-nav-ul>li:last').position().left;



      //$('.sys-tabs-navbar').scrollLeft(scrollTo); // simply update the scroll of the scroller
      setTimeout(function () {
          $('.sys-tabs-navbar').animate({'scrollLeft': scrollTo}, 1250); // use an animation to scroll to the destination
      }, 500);
      /*i.setTimeout(function () {
         if (t > -1) {
            var n = e === c ? !0 : !1,
               i = n ? T : C,
               r = i[0].scrollWidth,
               l = (n ? b : P).width();
            if (r > l) {
               var o = a.getElementById(n ? "sys-tabs-first-nav-ul" : "sys-tabs-second-nav-ul").getElementsByTagName("li")[t].offsetLeft,
                  s = r - l,
                  d = o > s ? s : o;
               i.data("scrollwheel", d), i.animate({
                  scrollLeft: d
               }, 3 * x)
            }
         }
      }, x)*/
   }

   function Qe(e, t, n, i, a) {
      var r = null === t ? !1 : t.name;
      r && ((c === n || c === a) && Je(c), (d === n || d === a) && Je(d))
   }

   function Ze(e, t) {
      "workingSetSort" === e.type ? Je(t) : "workingSetMove" === e.type && ($("#first-pane").length && Je(c), $("#second-pane").length && Je(d))
   }

   function et(e, t) {
      var n = I.findInWorkingSet(e, I.getCurrentlyViewedPath(e));
      n > -1 && t.find("li:not(.sys-tabs-null-element)").eq(n).addClass("selected")
   }

   function tt(e) {
      return z.getBaseName(e)
   }

   function nt(e) {
      return tt(z.getDirectoryPath(e))
   }

   function it(e, t) {
      for (var n = t.length; n--;)
         if (e.fullPath !== t[n].fullPath && tt(e.fullPath) === tt(t[n].fullPath)) return !0
   }

   function ut(e) {
      if (!$(e.target).is("li")) return !1;
      if ("dragstart" === e.type) ve = !0, rt = (at = $(e.target)).index(), lt = $(e.target.parentNode).attr("id"), ot = $(e.target).height(), st = $(e.target).html(), ct = re($(e.target)), e.originalEvent.dataTransfer.setData("Text", re($(e.target)).fullPath);
      else if ("dragenter" === e.type) {
         if (at) {
            $(e.target).after(Ee);
            var t = $(e.target.parentNode).children("li:not(.sys-tabs-prepare-placeholder)");
            $(e.target).hasClass("sys-tabs-sortable-placeholder") || (dt = t.index(Ee)), ft = $(e.target.parentNode).attr("id")
         }
      } else {
         if ("dragover" === e.type) return e.preventDefault(), at && ($(e.target.parentNode).find(".sys-tabs-prepare-placeholder").length || fe().prependTo($(e.target.parentNode)), at.hide(), Ee.height(ot), Ee.width(""), Ee.html(st)), !1;
         if ("dragend" === e.type) return e.stopPropagation(), ve = void 0, lt !== ft ? ke(ct, lt, dt, ft) : rt !== dt ? ye(rt, lt, dt) : Pe(at), at = void 0, !1;
         if ("drop" === e.type) return e.preventDefault(), !1
      }
   }

   function gt(e, t, n) {
      var
         i = I.getPaneTitle(e),
         r = '<div class="working-set-header"><span class="working-set-header-title">' + i + '</span><span class="sys-tabs-item-length">' + n.children().length + "</span></div>",
         l = $("#" + e).find(".CodeMirror").height(),
         o = l - 72,
         s = $(a.createElement("div")).attr({
            id: "sys-tabs-" + e + "-list-View",
            "class": "sys-tabs-box-list-view",
            "style": "left:" + setThePosition() + "px"
         }).on("contextmenu", ae).html(void 0 === i ? "" : r).insertAfter(t);
      s.on('mouseleave', function () {
        $(this).remove();
      })
      $(a.createElement("ul")).addClass("sys-tabs-ul-list-view").attr("id", "sys-tabs-" + e + "-ul-list-View").data(u, e).css("max-height", o).html(n.children().clone()).on("contextmenu.workingSetView", Se).on("click mouseenter mouseleave", "li", Ge).on("dragstart dragenter dragover dragend drop", "li", ut).appendTo(s);
   }

//"style" :  "position:fixed; left:" + ($('#sidebar').width()) + "px" //.position().left

   function pt(e, t) {
      var n = I.getWorkingSet(e),
         i = n[t],
         r = D.getLanguageForPath(i.fullPath).getId(),
         l = i.fullPath.substr(i.fullPath.lastIndexOf(".") + 1),
         o = '<span class="file-icon-bar sys-tabs-icon-' + r + " sys-tabs-icon-" + l + '"></span>',
         c = _.getOpenDocumentForPath(i.fullPath),
         d = '<div class="sys-tabs-file-status-icon dirty"></div>',
         u = null !== c && c.hasOwnProperty("isDirty") && c.isDirty ? d : "",
         g = it(i, I.getWorkingSet(s)) ? "<i class='directory'> &mdash; " + nt(i.fullPath) + "</i>" : "",
         p = o + L.getFileEntryDisplay(i) + g + u,
         h = $(a.createElement("li")).attr({
            "class": "sys-tabs-height-null",
            draggable: "true"
         }).html(p).on("click mouseenter mousemove mouseleave", Ge).on("dragstart dragenter dragover dragend drop", Me).mousedown(function (e) {
            e.stopPropagation()
         }).data(f, i);
      return {
         item: h,
         dup: it(i, n)
      }
   }

   function ht(e, t, n) {
      var i;
      for (i = 0; e > i; i += 1) pt(t, i).item.appendTo(n);
      et(t, n)
   }

   function wt() {
      E = $(a.createElement("div")).attr("class", "sys-tabs-toggle-listview sys-tabs-first-listview btn-alt-quiet").on("click", function (e) {
         $("#sys-tabs-first-pane-list-View").length ? $("#sys-tabs-first-pane-list-View").remove() : gt(c, v, T)
      }).html("&equiv;").appendTo(v);
   }

   function mt() {
      M = $(a.createElement("div")).attr("class", "sys-tabs-toggle-listview sys-tabs-second-listview btn-alt-quiet").on("click", function (e) {
         $("#sys-tabs-second-pane-list-View").length ? $("#sys-tabs-second-pane-list-View").remove() : gt(d, y, C)
      }).html("&equiv;").appendTo(y)
   }

   function vt() {
      if ($("#first-pane").length) {
         var e = I.getWorkingSetSize(c);
         e > 0 ? (T.empty(), ht(e, c, T), $("#sys-tabs-first-pane-list-View").length && ($("#sys-tabs-first-pane-list-View").find("ul").empty(), $("#sys-tabs-first-pane-list-View").find(".sys-tabs-item-length").html(T.children().length), T.children().clone().appendTo($("#sys-tabs-first-pane-list-View").find("ul"))), E.show()) : (T.html(V.EMPTY_VIEW_HEADER), E.hide(), $("#sys-tabs-first-pane-list-View").length && $("#sys-tabs-first-pane-list-View").remove())
      }
      if ($("#second-pane").length) {
         var t = I.getWorkingSetSize(d);
         t > 0 ? (C.empty(), ht(t, d, C), $("#sys-tabs-second-pane-list-View").length && ($("#sys-tabs-second-pane-list-View").find("ul").empty(), $("#sys-tabs-second-pane-list-View").find(".sys-tabs-item-length").html(C.children().length), C.children().clone().appendTo($("#sys-tabs-second-pane-list-View").find("ul"))), M.show()) : (C.html(V.EMPTY_VIEW_HEADER), M.hide(), $("#sys-tabs-second-pane-list-View").length && $("#sys-tabs-second-pane-list-View").remove())
      }
   }

   function $t(e) {
      window.setTimeout(function () {
         vt()
      }, 3 * x)
   }

   function bt() {
      Ie(), ze(), Re(), Oe(), Fe(), wt(), je()
   }

   function Tt() {
      Ue(), Be(), He(), mt()
   }

   function Et() {
      O.register("sys-tabs-listview", Q, function () {
         $("#" + I.getActivePaneId()).find(".sys-tabs-toggle-listview").click()
      }), F.addBinding(Q, "Ctrl-Shift-V", "all")
   }

   function kt(e) {
      $("#sys-tabs-first-pane-list-View").length && $("#sys-tabs-first-pane-ul-list-View").css("max-height", $("#first-pane").find(".CodeMirror").height() - 72), $("#sys-tabs-second-pane-list-View").length && $("#sys-tabs-second-pane-ul-list-View").css("max-height", $("#second-pane").find(".CodeMirror").height() - 72)
   }
   var g, p, h, w, v, b, T, E, k, y, P, C, M, S, ue, ge, pe, he, we, me, ve, $e, be, Te, at, rt, lt, ot, st, ct, dt, ft, i = window,
      a = i.document,
      r = $("#sidebar"),
      l = $("#main-toolbar"),
      o = $(".main-view .content"),
      s = "ALL_PANES",
      c = "first-pane",
      d = "second-pane",
      f = "file",
      u = "data-pane-id",
      m = $("#" + c),
      x = 5,
      V = brackets.getModule("strings"),
      I = brackets.getModule("view/MainViewManager"),
      _ = brackets.getModule("document/DocumentManager"),
      L = brackets.getModule("utils/ViewUtils"),
      W = brackets.getModule("utils/StringUtils"),
      D = brackets.getModule("language/LanguageManager"),
      N = brackets.getModule("project/SidebarView"),
      A = brackets.getModule("utils/Resizer"),
      z = brackets.getModule("file/FileUtils"),
      R = brackets.getModule("project/FileViewController"),
      O = brackets.getModule("command/CommandManager"),
      F = brackets.getModule("command/KeyBindingManager"),
      U = brackets.getModule("command/Commands"),
      B = brackets.getModule("preferences/PreferencesManager"),
      H = B.getExtensionPrefs("sys-tab"),
      q = "toggleToolbar",
      j = "hoverSidebar",
      K = "tooltip",
      X = "workingFilesSidebar",
      Y = "zIndex",
      G = "stepWheel",
      J = 50,
      Q = "sys-tabKeyIdListView",
      Z = brackets.getModule("command/Menus"),
      ee = Z.getContextMenu(Z.ContextMenuIds.SPLITVIEW_MENU),
      te = Z.getContextMenu(Z.ContextMenuIds.WORKING_SET_CONTEXT_MENU),
      ne = Z.getContextMenu(Z.ContextMenuIds.PROJECT_MENU),
      Ee = $(a.createElement("li")).attr("class", "sys-tabs-sortable-placeholder sys-tabs-null-element").html("&nbsp;");
   H.definePreference(q, "boolean", !0).on("change", function () {
      qe()
   }), H.definePreference(j, "boolean", !0).on("change", function () {
      var e = function () {
            H.get(j) && r.css({
               display: "-webkit-box",
               "z-index": 18
            });

            $('.sys-tabs-box-list-view').css({'left': setThePosition() + 'px'});
         },
         t = function () {
            H.get(j) && (!r.prev().is(".horz-resizer") || ne.isOpen() || $(".jstree-leaf").find(".jstree-rename-input").length || r.css({
               display: "none",
               "z-index": ""
            }));
            $('.sys-tabs-box-list-view').css({'left': setThePosition() + 'px'});
         };
      !N.isVisible() && r.prev().is(".horz-resizer") && r.prev().on("mouseenter", e), r.on("mouseleave", t)
   }), H.definePreference(K, "boolean", !0).on("change", function () {
      H.get(K) ? w = $(a.createElement("div")).attr({
         id: "sys-tabs-tooltip",
         "class": "sys-tabs-tooltip"
      }).html('<div class="sys-tabs-arrow"></div><span class="sys-tabs-parentPath">&nbsp;</span><span class="sys-tabs-date">&nbsp;</span><br><span class="sys-tabs-size">&nbsp;</span> &mdash; <span class="sys-tabs-charcount">&nbsp;</span>&nbsp;<span class="sys-tabs-lines">&nbsp;</span> &mdash; <span class="sys-tabs-lineEnding">&nbsp;</span> &mdash; <span class="sys-tabs-language">&nbsp;</span><span class="sys-tabs-hash">&nbsp;</span>').hide().appendTo(a.body) : w.remove()
   }), H.definePreference(X, "boolean", !0).on("change", function () {
      H.get(X) ? $("#working-set-list-container").addClass("sys-tabs-hide-working-set-list-container") : $("#working-set-list-container").removeClass("sys-tabs-hide-working-set-list-container")
   }), H.definePreference(Y, "number", !0).on("change", function () {
      var e = H.get(Y);
      "number" == typeof e && (v && v.css("z-index", e), y && y.css("z-index", e))
   }), H.definePreference(G, "number", !0).on("change", function () {
      var e = H.get(G);
      "number" != typeof e || 1 > e || (J = e)
   }), r.on("panelCollapsed", function () {
      Ne()
   }), r.on("panelExpanded", function () {
      De()
   }), I.on("paneLayoutChange", function (e, t, n) {
      We(), $(".sys-tabs-box-list-view").length && $(".sys-tabs-box-list-view").remove()
   }), I.on("activePaneChange", function (e, t, n) {
      var i = $("#" + t).find(".sys-tabs-navbar"),
         a = $("#" + n).find(".sys-tabs-navbar");
      i.addClass("focused-tabbar"), a.removeClass("focused-tabbar")
   }), I.on("workingSetAdd workingSetAddList workingSetRemove workingSetRemoveList workingSetUpdate", function (e) {
      $t(e)
   }), I.on("currentFileChange", function (e, t, n, i, a) {
      ve || ($t(e), Qe(e, t, n, i, a)), Ce()
   }), I.on("workingSetSort workingSetMove", function (e, t) {
      $t(e), Ze(e, t)
   }), _.on("dirtyFlagChange", function (e) {
      $t(e)
   }), I.on("paneCreate", function (e, t) {
      k = $("#" + d), Tt()
   }), $(i).resize(kt), $("#editor-holder").on("panelResizeUpdate", kt), n.exports = {
      viewTab: bt,
      keys: Et
   }
});
