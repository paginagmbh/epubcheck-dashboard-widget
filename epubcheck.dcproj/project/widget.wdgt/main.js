//
// Function: setElementText(elementName, elementValue)
// Set the text contents of an HTML div
//
// elementName: Name of the element in the DOM
// elementValue: Text to display in the element
//
function setElementText(elementName, elementValue, parentElement)
{
    var element = document.getElementById(elementName);
    if (element) {
        element.innerText = elementValue;
    }
    if(typeof(parentElement)!="undefined") {
        // alert('refresh parent');
        // document.getElementById(parentElement).object.refresh();
    }
}
function getElementText(elementName)
{
    var text = document.getElementById(elementName).innerText;
    if (text) {
        return text;
    }
}

function textRefresh(element) {
    document.getElementById(element).object.refresh();
}


//
// Function: load()
// Called by HTML body element's onload event when the widget is ready to start
//
function load()
{

    // Get the properties
    updateInterval = +attributes.updateInterval;
    if (!updateInterval) {
        updateInterval = 1;
    }
    
    setElementText("scrollContent", dashcode.getLocalizedString("Drag & Drop your EPUB file here to validate"), 'scrollArea');
}

//
// Function: remove()
// Called when the widget has been removed from the Dashboard
//
function remove()
{
    // Stop any timers to prevent CPU usage
    // Remove any preferences as needed
    // widget.setPreferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
}

//
// Function: hide()
// Called when the widget has been hidden
//
function hide()
{
    // nix
}

//
// Function: show()
// Called when the widget has been shown
//
function show()
{
    // nix
}

//
// Function: sync()
// Called when the widget has been synchronized with .Mac
//
function sync()
{
    // Retrieve any preference values that you need to be synchronized here
    // Use this for an instance key's value:
    // instancePreferenceValue = widget.preferenceForKey(null, dashcode.createInstancePreferenceKey("your-key"));
    //
    // Or this for global key's value:
    // globalPreferenceValue = widget.preferenceForKey(null, "your-key");
}

//
// Function: showBack(event)
// Called when the info button is clicked to show the back of the widget
//
// event: onClick event from the info button
//
function showBack(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (window.widget) {
        widget.prepareForTransition("ToBack");
    }

    front.style.display="none";
    back.style.display="block";

    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

//
// Function: showFront(event)
// Called when the done button is clicked from the back of the widget
//
// event: onClick event from the done button
//
function showFront(event)
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");
    
    if (window.widget) {
        widget.prepareForTransition("ToFront");
    }
    
    front.style.display="block";
    back.style.display="none";
    
    if (window.widget) {
        setTimeout('widget.performTransition();', 0);
    }
}

if (window.widget)
{
    widget.onremove = remove;
    widget.onhide = hide;
    widget.onshow = show;
    widget.onsync = sync;
}


// Diesen Handler auf den Event „ondrop“
// auf ein Drop-Ziel in Ihrer Widget-Oberfläche zuweisen
function dragDrop(event)
{
    
    set_background('reset');
    

	try {
		// URIs der Drop-Objekte beibehalten
		var uriString = event.dataTransfer.getData("text/uri-list");	
		
		// URIs in ein Array aufspalten
		var uriList = uriString.split("\n");
        
        
        // Multi-Drop
        if(uriList.length > 1) {
        
            setElementText("scrollContent", "Fehler! Es können nicht mehrere Dateien gleichzeitig validiert werden!", 'scrollArea');
            
        // Single-Drop
        } else {
            
            var filePath = uriString.replace("file://localhost", "");
            var fileName = uriString.match(/[^\/]*\..{2,4}/);
            // alert(fileName);
            
            setElementText("scrollContent", __("Checking file") + ' "' + filePath + '"', 'scrollArea');
            
            var output = widget.system("java -jar epubcheck/epubcheck-1.2.jar " + filePath + " | /bin/cat", processed);
            
            
            var epubcheck_error = false;
            
            var Std_SeRep = new Array();
            var RegExp_SeRep = new Array();
            
            
            function processed() {
            
                var stdOutput = this.outputString;
                var errorOutput = this.errorString;
                
                if(/EXIT/.test(output.errorString) ) {
                    epubcheck_error = true;
                } else if(/warnings or errors/.test(output.errorString)) {
                    epubcheck_error = true;
                } else {
                    epubcheck_error = false;
                }
                
                ArrayFill(Std_SeRep, /ERROR:/g, "\n" + __("ERROR:"));
                ArrayFill(Std_SeRep, /WARNING:/g, "\n" + __("WARNING:"));
                
                
	            ArrayFill(Std_SeRep, new RegExp(filePath, 'g'), fileName)
	            ArrayFill(Std_SeRep, new RegExp("Check finished with warnings or errors!", "g"), "\n" + __("Check finished with warnings or errors!"));
	            ArrayFill(Std_SeRep, /referenced resource missing in the package/g, __("referenced resource missing in the package"));
	            ArrayFill(Std_SeRep, /referenced resource exists, but not declared in the OPF file/g, __("referenced resource exists, but not declared in the OPF file"));
	            ArrayFill(Std_SeRep, /unfinished element/g, __("unfinished element"));
	            ArrayFill(Std_SeRep, /No errors or warnings detected/g, "\n" + __("No errors or warnings detected"));
	            ArrayFill(Std_SeRep, /filename does not include '.epub' suffix/g, __("filename does not include '.epub' suffix"));
	            ArrayFill(Std_SeRep, /No .epub file to check was specified in arguments!/g, __("No .epub file to check was specified in arguments!"));
	            ArrayFill(Std_SeRep, /The tool will EXIT!/g, __("The tool will EXIT!"));
	            ArrayFill(Std_SeRep, /cannot read header/g, __("cannot read header"));
	            ArrayFill(Std_SeRep, /corrupted ZIP header/g, __("corrupted ZIP header"));
	            ArrayFill(Std_SeRep, /mimetype entry missing or not the first in archive/g, __("mimetype entry missing or not the first in archive"));
	            ArrayFill(Std_SeRep, /mimetype contains wrong type (application\/epub+zip expected)/g, __("mimetype contains wrong type (application/epub+zip expected)"));
	            ArrayFill(Std_SeRep, /Failed performing NCX Schematron tests:/g, __("Failed performing NCX Schematron tests:"));
	            ArrayFill(Std_SeRep, /Required META-INF\/container.xml resource is missing/g, __("Required META-INF/container.xml resource is missing"));
	            ArrayFill(Std_SeRep, /RootPath is not an OPF file/g, __("RootPath is not an OPF file"));
	            ArrayFill(Std_SeRep, /Failed performing OPF Schematron tests:/g, __("Failed performing OPF Schematron tests:"));
	            ArrayFill(Std_SeRep, /text\/html is not appropriate for OEBPS 1.2, use text\/x-oeb1-document instead/g, __("text/html is not appropriate for OEBPS 1.2, use text/x-oeb1-document instead"));
	            ArrayFill(Std_SeRep, /empty media-type attribute/g, __("empty media-type attribute"));
	            ArrayFill(Std_SeRep, /text\/html is not appropriate for XHTML\/OPS, use application\/xhtml+xml instead/g, __("text/html is not appropriate for XHTML/OPS, use application/xhtml+xml instead"));
	            ArrayFill(Std_SeRep, /text\/html is not appropriate for OEBPS 1.2, use text\/x-oeb1-document instead/g, __("text/html is not appropriate for OEBPS 1.2, use text/x-oeb1-document instead"));
	            ArrayFill(Std_SeRep, /fallback-style item could not be found/g, __("fallback-style item could not be found"));
	            ArrayFill(Std_SeRep, /OPF file is using OEBPS 1.2 syntax allowing backwards compatibility/g, __("OPF file is using OEBPS 1.2 syntax allowing backwards compatibility"));
	            ArrayFill(Std_SeRep, /unique-identifier attribute in package element must be present and have a value/g, __("unique-identifier attribute in package element must be present and have a value"));
	            ArrayFill(Std_SeRep, 'toc attribute references resource with non-NCX mime type; "application/x-dtbncx+xml" is expected')
	            ArrayFill(Std_SeRep, /assertion failed:/g, __("assertion failed:"));
	            ArrayFill(Std_SeRep, /playOrder sequence has gaps/g, __("playOrder sequence has gaps"));
	            ArrayFill(Std_SeRep, /required attributes missing/g, __("required attributes missing"));
	            ArrayFill(Std_SeRep, /Epubcheck will not validate ePubs with encrypted required content files!/g, "\n" + "   " + __("Epubcheck will not validate ePubs with encrypted required content files!"));
	            ArrayFill(Std_SeRep, /Tool will EXIT/g, "\n" + "\n" + "\n" + __("Tool will EXIT"));
	            ArrayFill(Std_SeRep, /File listed in reference element in guide was not declared in OPF manifest:/g, __("File listed in reference element in guide was not declared in OPF manifest:"));
	            ArrayFill(Std_SeRep, /zip file contains empty directory/g, __("zip file contains empty directory"));
	            ArrayFill(Std_SeRep, /Unable to read zip file entries./g, __("Unable to read zip file entries."));
	            ArrayFill(Std_SeRep, /OPF file is using OEBPS 1.2 syntax allowing backwards compatibility/g, __("OPF file is using OEBPS 1.2 syntax allowing backwards compatibility"));        
                
                
                
                
                ArrayFill(RegExp_SeRep, /\((\d+)\):?/g, " (" + __("line $1") + "):" + "\r\n" + "   ")
                ArrayFill(RegExp_SeRep, /\.(epub):\s/gi, ".$1:" + "\r\n" + "   ")
                ArrayFill(RegExp_SeRep, /\.(epub)(([-a-z0-9_/]*)\.([a-z0-9]{2,4})):\s/gi, ".$1$2:" + "\r\n" + "   ")
                //ArrayFill(RegExp_SeRep, /\n/g, "\r\n")
                ArrayFill(RegExp_SeRep, /Epubcheck Version (\d\.\d?\.?\d?\.?\d?\.?)$/g, __("Epubcheck Version $1") & "\r\n")
                ArrayFill(RegExp_SeRep, /EpubPreflight Version (\d\.\d?\.?\d?\.?\d?\.?)$/g, __("EpubPreflight Version $1") & "\r\n")
                ArrayFill(RegExp_SeRep, /length of first filename in archive must be 8, but was (\d+)/g, __("length of first filename in archive must be 8, but was $1"))
                ArrayFill(RegExp_SeRep, /extra field length for first filename must be 0, but was (\d+)/g, __("extra field length for first filename must be 0, but was $1"))
                ArrayFill(RegExp_SeRep, /The file (.*) does not appear to be of type (.*)/g, __("The file $1 does not appear to be of type $2"))
                ArrayFill(RegExp_SeRep, /image file (.*) is missing/g, __("image file $1 is missing"))
                ArrayFill(RegExp_SeRep, /image file (.*) cannot be decrypted/g, __("image file $1 cannot be decrypted"))
                ArrayFill(RegExp_SeRep, /image file (.*) is too short/g, __("image file $1 is too short"))
                ArrayFill(RegExp_SeRep, /DTBook file (.*) is missing/g, __("DTBook file $1 is missing"))
                ArrayFill(RegExp_SeRep, /DTBook file (.*) cannot be decrypted/g, __("DTBook file $1 cannot be decrypted"))
                ArrayFill(RegExp_SeRep, /NCX file (.*) is missing/g, __("NCX file $1 is missing"))
                ArrayFill(RegExp_SeRep, /NCX file (.*) cannot be decrypted/g, __("NCX file $1 cannot be decrypted"))
                ArrayFill(RegExp_SeRep, /OPF file (.*) is missing/g, __("OPF file $1 is missing"))
                ArrayFill(RegExp_SeRep, /deprecated media-type (.*)/g, __("deprecated media-type $1"))
                ArrayFill(RegExp_SeRep, /use of OPS media-type '(.*)' in OEBPS 1.2 context; use text\/x-oeb1-document instead/g, __("use of OPS media-type '$1' in OEBPS 1.2 context; use text/x-oeb1-document instead"))
                ArrayFill(RegExp_SeRep, /use of OPS media-type '(.*)' in OEBPS 1.2 context; use text\/x-oeb1-css instead/g, __("use of OPS media-type '$1' in OEBPS 1.2 context; use text/x-oeb1-css instead"))
                ArrayFill(RegExp_SeRep, /'(.*)' is not a permissible spine media-type/g, __("'$1' is not a permissible spine media-type"))
                ArrayFill(RegExp_SeRep, /non-standard media-type '(.*)' with no fallback/g, __("non-standard media-type '$1' with no fallback"))
                ArrayFill(RegExp_SeRep, /non-standard media-type '(.*)' with fallback to non-spine-allowed media-type/g, __("non-standard media-type '$1' with fallback to non-spine-allowed media-type"))
                ArrayFill(RegExp_SeRep, /item with id '(.*)' not found/g, __("item with id '$1' not found"))
                ArrayFill(RegExp_SeRep, /use of deprecated element '(.*)'/g, __("use of deprecated element '$1'"))
                ArrayFill(RegExp_SeRep, /role value '(.*)' is not valid/g, __("role value '$1' is not valid"))
                ArrayFill(RegExp_SeRep, /date value '(.*)' is not valid./g, __("date value '$1' is not valid.") & "\r\n" + "   ")
                ArrayFill(RegExp_SeRep, /The date must be in the form YYYY, YYYY-MM or YYYY-MM-DD/g, __("The date must be in the form YYYY, YYYY-MM or YYYY-MM-DD") & "\r\n" + "   ")
                ArrayFill(RegExp_SeRep, /\(e.g., "1993", "1993-05", or "1993-05-01"\)\./g, __('(e.g., "1993", "1993-05", or "1993-05-01").') & "\r\n" + "   ")
                ArrayFill(RegExp_SeRep, /See http:\/\/www.w3.org\/TR\/NOTE-datetime./g, __("See http://www.w3.org/TR/NOTE-datetime."))
                ArrayFill(RegExp_SeRep, /hyperlink to non-standard resource '(.*)' of type '(.*)'/g, __("hyperlink to non-standard resource '$1' of type '$2'"))
                ArrayFill(RegExp_SeRep, /hyperlink to resource outside spine '(.*)'/g, __("hyperlink to resource outside spine '$1'"))
                ArrayFill(RegExp_SeRep, /non-standard image resource '(.*)' of type '(.*)'/g, __("non-standard image resource '$1' of type '$2'"))
                ArrayFill(RegExp_SeRep, /fragment identifier missing in reference to '(.*)'/g, __("fragment identifier missing in reference to '$1'"))
                ArrayFill(RegExp_SeRep, /fragment identifier used for image resource '(.*)'/g, __("fragment identifier used for image resource '$1'"))
                ArrayFill(RegExp_SeRep, /fragment identifier used for stylesheet resource '(.*)'/g, __("fragment identifier used for stylesheet resource '$1'"))
                ArrayFill(RegExp_SeRep, /fragment identifier is not defined in '(.*)'/g, __("fragment identifier is not defined in '$1'"))
                ArrayFill(RegExp_SeRep, /fragment identifier '(.*)' defines incompatible resource type in '(.*)'/g, __("fragment identifier '$1' defines incompatible resource type in '$2'"))
                ArrayFill(RegExp_SeRep, /resource (.*) is missing/g, __("resource $1 is missing"))
                ArrayFill(RegExp_SeRep, /resource (.*) cannot be decrypted/g, __("resource $1 cannot be decrypted"))
                ArrayFill(RegExp_SeRep, /OPS\/XHTML file (.*) is missing/g, __("OPS/XHTML file $1 is missing"))
                ArrayFill(RegExp_SeRep, /OPS\/XHTML file (.*) cannot be decrypted/g, __("OPS/XHTML file $1 cannot be decrypted"))
                ArrayFill(RegExp_SeRep, /use of non-registered URI schema type in href: (.*)$/g, __("use of non-registered URI schema type in href: $1"))
                ArrayFill(RegExp_SeRep, /Only UTF-8 and UTF-16 encodings are allowed for XML, detected (.*)/g, "\r\n" + "   " + __("Only UTF-8 and UTF-16 encodings are allowed for XML, detected $1") & "\r\n")
                ArrayFill(RegExp_SeRep, /Malformed byte sequence: (.*) Check encoding/g, __("Malformed byte sequence: $1 Check encoding"))
                ArrayFill(RegExp_SeRep, /could not parse (.*):/g, __("could not parse $1:"))
                ArrayFill(RegExp_SeRep, /element "(.*)" from namespace "(.*)" not allowed in this context/g, __('element "$1" from namespace "$2" not allowed in this context'))
                ArrayFill(RegExp_SeRep, /unknown element "(.*)" from namespace "(.*)"/g, __('unknown element "$1" from namespace "$2"'))
                ArrayFill(RegExp_SeRep, /attribute "(.*)" not allowed at this point; ignored/g, __('attribute "$1" not allowed at this point; ignored'))
                ArrayFill(RegExp_SeRep, /Epubcheck will not validate ([^\.]+\.\w+)\b/g, __("Epubcheck will not validate '$1'"))
                ArrayFill(RegExp_SeRep, /\b([^\.\s]+\.\w+) is an encrypted non-required entry! /g, __("'$1' is an encrypted non-required entry!"))
                ArrayFill(RegExp_SeRep, /\b([^\.\s]+\.\w+) is an encrypted required entry! /g, __("'$1' is an encrypted required entry!"))
                ArrayFill(RegExp_SeRep, /item \((.*)\) exists in the zip file, but is not declared in the OPF file/g, __("item ($1) exists in the zip file, but is not declared in the OPF file"))
                ArrayFill(RegExp_SeRep, /element "([a-z0-9_:]*)" missing required attribute "([-a-z0-9_:]*)"/g, __('element "$1" missing required attribute "$2"'))
                ArrayFill(RegExp_SeRep, /attribute "([-a-z0-9_:]*)" not allowed here; expected attribute ([a-z0-9-_",: ]*) or "([-a-z0-9_:]*)"/g, __('attribute "$1" not allowed here; expected attribute $2 or "$3"'))
                ArrayFill(RegExp_SeRep, /attribute "([-a-z0-9_:]*)" not allowed here; expected attribute ([a-z0-9-_",: ]*)/g, __('attribute "$1" not allowed here; expected attribute $2'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" not allowed here; expected the element end-tag, text or element ([-a-z0-9_",: ]*) or "([-a-z0-9_:]*)" \(with ([^\)]*)\)/g, __('element "$1" not allowed here; expected the element end-tag, text or element $2 or "$3" (with $4)'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" not allowed here; expected the element end-tag or element ([-a-z0-9_",: ]*) or "([-a-z0-9_:]*)" \(with ([^\)]*)\)/g, __('element "$1" not allowed here; expected the element end-tag or element $2 or "$3" (with $4)'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" not allowed here; expected element ([-a-z0-9_",: ]*) or "([-a-z0-9_:]*)" \(with ([^\)]*)\)/g, __('element "$1" not allowed here; expected element $2 or "$3" (with $4)'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" not allowed anywhere; expected the element end-tag or text/g, __('element "$1" not allowed anywhere; expected the element end-tag or text'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" not allowed anywhere; expected element ([-a-z0-9_",: ]*)/g, __('element "$1" not allowed anywhere; expected element $2'))
                ArrayFill(RegExp_SeRep, /element "([-a-z0-9_:]*)" incomplete; expected element ([-a-z0-9_",: ]*) or "([-a-z0-9_:]*)" \(with ([^\)]*)\)/g, __('element "$1" incomplete; expected element $2 or "$3" (with $4)'))
                
                
                // var test = "\"";
                // var test2 = '\'';
                
                for (var i = 0; i < Std_SeRep.length; ++i) {
                    if(typeof(stdOutput)!="undefined") {
                        stdOutput = stdOutput.replace(Std_SeRep[i][0], Std_SeRep[i][1]);
                    }
                    if(typeof(errorOutput)!="undefined") {
                        errorOutput = errorOutput.replace(Std_SeRep[i][0], Std_SeRep[i][1]);
                    }
                }
                for (var i = 0; i < RegExp_SeRep.length; ++i) {
                
                    if(typeof(stdOutput)!="undefined") {
                        stdOutput = stdOutput.replace(RegExp_SeRep[i][0], RegExp_SeRep[i][1]);
                    }
                    if(typeof(errorOutput)!="undefined") {
                        errorOutput = errorOutput.replace(RegExp_SeRep[i][0], RegExp_SeRep[i][1]);
                    }
                }

                if(typeof(stdOutput)!="undefined") {
                    setElementText("scrollContent", getElementText("scrollArea") + "\n\n" + stdOutput, 'scrollArea');
                }
                if(typeof(errorOutput)!="undefined") {
                    setElementText("scrollContent", getElementText("scrollArea") + errorOutput, 'scrollArea');
                }
                
                            
                
                if(epubcheck_error) {
                    set_background('error');
                } else {
                    set_background('valid');
                }
            }
            
            
            
        }
        
        
	} catch (ex) {
        set_background('error');
        setElementText("scrollContent", __("D'oh! Something went wrong...") + "\n" + __("Maybe this cryptic error message will provide help in fixing the problem:") + "\n\n" + ex, 'scrollArea');
		alert();
	}
    
	event.stopPropagation();
	event.preventDefault();
}


// Stellen Sie sicher, dass Sie diese Handler für die Events „ondragenter“
// und „ondragover“ auf Ihr Drop-Ziel zuweisen
// Diese Handler verhindern, dass Web Kit 
// Drag-Events verarbeitet, sodass Sie den Drop-Vorgang bei Auftreten bearbeiten können
function dragEnter(event)
{
	event.stopPropagation();
	event.preventDefault();
}
function dragOver(event)
{
	event.stopPropagation();
	event.preventDefault();
    
    set_background('reset');
    setElementText("scrollContent", __("Yeah! Drop your EPUB here!"), 'scrollArea');
}


function set_background(type) {
    // Fallback
    var bg_image = "Images/front_normal.png";
    
    if(type == "error") { bg_image = "Images/front_red.png"; }
    if(type == "valid") { bg_image = "Images/front_green.png"; }
    if(type == "reset") { bg_image = "Images/front_normal.png"; }
    
    document.getElementById("frontImg").setAttribute("src", bg_image);
}


function ArrayFill(fillArray, string, string_2) {
    
    if(typeof(string_2)=="undefined") {
        str2 = dashcode.getLocalizedString(string);
    } else {
        str2 = string_2;
    }
                   
    var tempArray = new Array(string, str2);
                                        
    fillArray.push(tempArray);
                    
}


function __(string) {
    return dashcode.getLocalizedString(string);
}
