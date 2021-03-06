/* 
 This file was generated by Dashcode and is covered by the 
 license.txt included in the project.  You may edit this file, 
 however it is recommended to first turn off the Dashcode 
 code generator otherwise the changes will be lost.
 */

function CreateInfoButton(elementOrID, spec)
{
    var flipElement = elementOrID;
    if (elementOrID.nodeType != Node.ELEMENT_NODE) {
        flipElement = document.getElementById(elementOrID);
    }
	if (!flipElement.loaded) {
		flipElement.loaded = true;
        while (flipElement.firstChild) {
            flipElement.removeChild(flipElement.firstChild);
        }
        
		var onclick = spec.onclick || null;
		try { onclick = eval(onclick); } catch (e) { onclick = null; }

		flipElement.object = new AppleInfoButton(flipElement, document.getElementById(spec.frontID), spec.foregroundStyle, spec.backgroundStyle, onclick);
        flipElement.object.element = flipElement;
	}

	return flipElement.object;
}
