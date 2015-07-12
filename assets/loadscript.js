

    var wrapperId = document.querySelector("XPATH").getAttribute("id");
    if ( wrapperId === null){
        wrapperId = "olapic_widget";
        document.querySelector("XPATH").setAttribute("id", wrapperId);
    }

    function renderWidget(options){
        var settings = { wrapper: options.wrapper, id : options.id };
        window.olapic.prepareWidget(settings, { "renderNow" : true });
    }
    function onOlapicLoad(){
        OlapicSDK.conf.set("apikey", "APIKEY");
        window.olapic = window.olapic || new OlapicSDK.Olapic( function(o){
            window.olapic = o;
            renderWidget({"id":"WIDGETINSTANCE", "wrapper":wrapperId});
        });
    };
    var scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.async = true;
    scriptTag.src = "BUILDURL";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(scriptTag, s);
