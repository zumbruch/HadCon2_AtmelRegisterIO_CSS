importPackage(Packages.org.csstudio.opibuilder.scriptUtil);

var portsOffset=0;
var typeOffset=8;
var debugOffset=11;
var templateOffset=7; 

var debug = PVUtil.getLong(pvs[debugOffset]);
types = [  "PIN" , "PORT" ,"DDR" ];
ports = [ "A","B","C","D","E","F","G" ];

if ( null == widget.getVar("templateName"))
{
	widget.setVar("templateName",      PVUtil.getString(pvs[templateOffset]));                   
	widget.setVar("templateFile",      widget.getWidget(widget.getVar("templateName")).getPropertyValue("opi_file"));
	widget.setVar("templateGroupName", widget.getWidget(widget.getVar("templateName")).getPropertyValue("group_name"));
}

var templateFile      = widget.getVar("templateFile")     ;
var templateGroupName = widget.getVar("templateGroupName");

if (0 != debug) { 
	ConsoleUtil.writeInfo("DEBUG: " + "templateName " + widget.getVar("templateName"));
	ConsoleUtil.writeInfo("DEBUG: " + "templateFile " + templateFile);
	ConsoleUtil.writeInfo("DEBUG: " + "templateGroupName " + templateGroupName);
}

widget.removeAllChildren();

for(var i=0; i<ports.length; i++){
	if (0 == PVUtil.getLong(pvs[i + portsOffset]))
	{
		if (0 != debug) { ConsoleUtil.writeInfo("DEBUG: " + "port " + ports[i] + " skipped");}
		continue;
	}
	else
	{
		if (0 != debug) { ConsoleUtil.writeInfo( "DEBUG: " + "port " + ports[i] + " chosen");}
	}
	
	for(var j=0; j<types.length; j++){
 	
	    var insert = PVUtil.getLong(pvs[j + typeOffset] );
		if (0 != debug) {ConsoleUtil.writeInfo( "DEBUG: " + ports[i] + "/" + j + " --- " + types[j] + ports[i] + " (" + pvs[j+typeOffset] + ")");}
		
		if ( 0 == insert) 
		{
			if (0 != debug) {ConsoleUtil.writeInfo( "DEBUG: " + types[j] + "x " + insert + " skip");}
			continue;
		}
		else
		{
			if (0 != debug) {ConsoleUtil.writeInfo( "DEBUG: " + types[j] + "x " + insert + " show");}
		}
		
		//create linking container
		var linkingContainer = WidgetUtil.createWidgetModel("org.csstudio.opibuilder.widgets.linkingContainer");	
//		linkingContainer.setPropertyValue("opi_file", opiPath);
		linkingContainer.setPropertyValue("opi_file", templateFile);
		linkingContainer.setPropertyValue("auto_size", true);
		linkingContainer.setPropertyValue("zoom_to_fit", false);
//		linkingContainer.setPropertyValue("group_name", "Controls");
		linkingContainer.setPropertyValue("group_name", templateGroupName);
		linkingContainer.setPropertyValue("name", ("Controls" + types[j] + ports[i]));
		linkingContainer.setPropertyValue("border_style", 0);
	
		//add macros
		linkingContainer.addMacro("index", i);
		linkingContainer.addMacro("RegName", types[j]+ports[i]);
		linkingContainer.addMacro("NAME",  ":" + ports[i]);

		//add linking container to widget
		widget.addChildToBottom(linkingContainer);

	}
}

widget.performAutosize();
display.performAutosize();


