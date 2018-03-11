// ============
// get page link list
// ============
// javascript - How to use document.evaluate() and XPath to get a list of elements? - Stack Overflow
// https://stackoverflow.com/questions/36303869/how-to-use-document-evaluate-and-xpath-to-get-a-list-of-elements
//
function getElementsByXPath(xpath, memberName, parent) {
    let results = [];
    // document.evaluate的详细用法--使用XPath查找某些节点对象[z] - liudaoru - 悟 - ITeye博客
    // http://liudaoru.iteye.com/blog/129748
    //
    let query = document.evaluate(xpath,
        parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        if (memberName) {
            // javascript - Getting data-* attribute for onclick event for an html element - Stack Overflow
            //https://stackoverflow.com/questions/20030162/getting-data-attribute-for-onclick-event-for-an-html-element
            //
            results.push(query.snapshotItem(i).getAttribute(memberName));
        } else {
            results.push(query.snapshotItem(i));
        }
    }
    return results;
}

// XPath Syntax
// https://www.w3schools.com/xml/xpath_syntax.asp
//
// XPath Cheatsheet --> https://github.com/LeCoupa/awesome-cheatsheets
// https://gist.github.com/LeCoupa/8c305ec8c713aad07b14
//
// xml - How can I find the link URL by link text with XPath? - Stack Overflow
// https://stackoverflow.com/questions/915338/how-can-i-find-the-link-url-by-link-text-with-xpath
//
var myLink = getElementsByXPath("//ul[@class='nav nav-pills nav-stacked']/li/a");

//===========
// get iFrame element in book mode
//===========
function getframe(){
    var str = location.href;
    var pos = str.indexOf("https%3A%2F%2Fhackmd.io%2F");
    str = str.slice(pos);
    str = str.replace(/%/g, "");
    return document.getElementById(str);
}

var myFrame = getframe();

//============
// go to next page link callback function
//============
function gotoNextLink(unregister, eventHandler) {
    // JavaScript Array shift() Method
    //https://www.w3schools.com/jsref/jsref_shift.asp
    //
    myLink_tmp = myLink.shift();
    // Javascript: access to an object's member by name - Stack Overflow
    // https://stackoverflow.com/questions/2132784/javascript-access-to-an-objects-member-by-name
    //
    // javascript - Getting data-* attribute for onclick event for an html element - Stack Overflow
    //https://stackoverflow.com/questions/20030162/getting-data-attribute-for-onclick-event-for-an-html-element
    //
    myLink_href = myLink_tmp.getAttribute("href");
    myLink_data_href = myLink_tmp.getAttribute("data-href");

    console.log(myLink_href);

    // [Blog Post] How To Modify Current URL Without Reloading or Redirection Using JavaScript(location.hash, history.pushState, history.replaceState) | Mahmut Can Sozeri
    // https://mcansozeri.wordpress.com/2013/04/03/blog-post-how-to-modify-current-url-without-reloading-or-redirection-using-javascriptlocation-hash-history-pushstate-history-replacestate/
    //
    // HTML5 简介（三）：利用 History API 无刷新更改地址栏 - Blog - Renfei Song
    // https://www.renfei.org/blog/html5-introduction-3-history-api.html
    //
    // javascript - Updating address bar with new URL without hash or reloading the page - Stack Overflow
    // https://stackoverflow.com/questions/3338642/updating-address-bar-with-new-url-without-hash-or-reloading-the-page
    //
    window.history.pushState(null, null, myLink_href);

    myFrame.contentWindow.document.location.href = myLink_data_href;

    if (myLink.length == 0) {
        unregister(eventHandler);
    }
}

//=============
// unregister onload event while no further pages
//=============
// jquery - Javascript - Cancel onload event - Stack Overflow
// https://stackoverflow.com/questions/3717205/javascript-cancel-onload-event
function onloadUnregister(onloadHandler){
    onloadHandler = null;
}

//=============
// register onload event to the frame
//=============
myFrame.onload = function() { gotoNextLink(onloadUnregister, myFrame.onload); };

//===========
// trigger onload event to the frame
//===========
// Force a window.onload event in javascript - Stack Overflow
// https://stackoverflow.com/questions/9642823/force-a-window-onload-event-in-javascript
//
// Creating and triggering events - Web developer guides | MDN
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
//
myFrame.dispatchEvent(new Event('load'));

