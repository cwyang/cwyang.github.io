/*
  spa.shell.js
*/

/*jslint
  browser : true,
  continue : true,
  devel : true,
  indent : 2,
  maxerr : 50,
  newcap : true,
  nomen: true,
  plusplus : true,
  regexp : true,
  sloppy : true,
  vars : true,
  white : true
*/
/*global $, spa */

spa.shell = (function () {
    // begin module scope vars
    var
    configMap = {
        anchor_schema_map : {
            chat : { opened : true, closed : true }
        },
        main_html : String()
            + '<div class="spa-shell-head" >'
                + '<div class="spa-shell-head-logo" ></div>'
                + '<div class="spa-shell-head-acct" ></div>'
                + '<div class="spa-shell-head-search" ></div>'
            + '</div>'
            + '<div class="spa-shell-main" >'
                + '<div class="spa-shell-main-nav" ></div>'
                + '<div class="spa-shell-main-content" ></div>'
            + '</div>'
            + '<div class="spa-shell-foot" ></div>'
            + '<div class="spa-shell-modal" ></div>',
        resize_interval: 200
    },
    stateMap = {
        $container: undefined,
        anchor_map : {},
        resize_idto: undefined
    },
    jqueryMap = {},

    copyAnchorMap, setJqueryMap, toggleChat, 
    changeAnchorPart, onHashChange, onResize,
    setChatAnchor, initModule;

    // begin utility methods: functions that don't interact with page elements
    // returns copy of stored anchor map; minimizes overhead
    copyAnchorMap = function () {
        return $.extend( true, {}, stateMap.anchor_map );
    };
    // begin dom methods
    // setJqueryMap
    setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = { $container : $container };
    };
    // changeAnchorPart
    changeAnchorPart = function (arg_map) {
        var
        anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;

        // begin merge changes into anchor map
        KEYVAL:
        for ( key_name in arg_map ) {
            if ( arg_map.hasOwnProperty( key_name ) ) {
                // skip dependent keys during iteration
                if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }
                // update independent key value
                anchor_map_revise[key_name] = arg_map[key_name];
                // update mathcing dependent key
                key_name_dep = '_' + key_name;
                if (arg_map[key_name_dep] ) {
                    anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                }
                else {
                    delete anchor_map_revise[key_name_dep];
                    delete anchor_map_revise['_s' + key_name_dep];
                }
            }
        }
        // attempt to update URI; revert if not successful
        try {
            console.log(anchor_map_revise);
            $.uriAnchor.setAnchor( anchor_map_revise );
        }
        catch (error ) {
            $.uriAnchor.setAnchor( stateMap.anchor_map, null, true);
            bool_return = false;
        }
        return bool_return;
    };
        
    // begin event handlers
    onHashChange = function (event) {
        var
        _s_chat_previous, _s_chat_proposed, s_chat_proposed,
        anchor_map_proposed,
        is_ok = true,
        anchor_map_previous = copyAnchorMap();

        // attempt to parse anchor
        try { anchor_map_proposed = $.uriAnchor.makeAnchorMap(); }
        catch (error) {
            $.uriAnchor.setAnchor( anchor_map_previous, null, true );
            return false;
        }

        stateMap.anchor_map = anchor_map_proposed;
        
        // convenience vars
        _s_chat_previous = anchor_map_previous._s_chat;
        _s_chat_proposed = anchor_map_proposed._s_chat;
        // adjust chat compopnent if changed
        if ( ! anchor_map_previous || _s_chat_previous !== _s_chat_proposed) {
            s_chat_proposed = anchor_map_proposed.chat;
            switch ( s_chat_proposed ) {
            case 'opened' :
                is_ok = spa.chat.setSliderPosition( 'opened' );
                break;
            case 'closed' :
                is_ok = spa.chat.setSliderPosition( 'closed' );
                break;
            default :
                spa.chat.setSliderPosition( 'closed' );
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor( anchor_map_proposed, null, true );
            }
        }
        // begin revert anchor if slider change is denied
        if (!is_ok) {
            if (anchor_map_previous) {
                $.uriAnchor.setAnchor( anchor_map_previous, null, true);
                stateMap.anchor_map = anchor_map_previous;
            } else {
                delete anchor_map_proposed.chat;
                $.uriAnchor.setAnchor( anchor_map_proposed, null, true);
            }
        } 
        return false;
    };
    onResize = function () {
        if (stateMap.resize_idto) {
            return true;
        }
        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
            function () { stateMap.resize_idto = undefined; },
            configMap.resize_interval
        );
        return true;
    };

    // begin callbacks
    setChatAnchor = function( position_type) {
        return changeAnchorPart({ chat: position_type });
    };

    // begin public methods
    // initModule
    initModule = function ( $container ) {
        stateMap.$container = $container;
        $container.html( configMap.main_html );
        setJqueryMap();

        // configure uriAnchor
        $.uriAnchor.configModule({
            schema_map : configMap.anchor_schema_map
        });

        // configure and init feature modules
        spa.chat.configModule( {
            set_chat_anchor: setChatAnchor,
            chat_model:         spa.model.chat,
            people_model:       spa.model.people
        } );
        spa.chat.initModule( jqueryMap.$container );
        
        // handle URI anchor change events.
        $(window)
            .bind('resize', onResize)
            .bind('hashchange', onHashChange)
            .trigger('hashchange');
    };

    return { initModule : initModule };
}());

