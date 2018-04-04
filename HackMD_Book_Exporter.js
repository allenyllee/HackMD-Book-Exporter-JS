// ============
// get page link from bookmode sidebar
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
var isManual = false;

//===========
// get iFrame element from bookmode content
//===========
function getframe() {
    // Location href Property
    // https://www.w3schools.com/jsref/prop_loc_href.asp
    // 透過HTML DOM 的 Location Object 的 href Property 取得目前頁面的URL
    var str = location.href;
    // JavaScript String Methods
    // https://www.w3schools.com/js/js_string_methods.asp
    // 分析HackMD 的網址，知道是以字串"https%3A%2F%2Fhackmd.io%2F"開頭到結束的整串去除%符號，作為iframe 的id
    // 利用 indexOf() 方法找出字串位置，再利用slice() 進行切割
    // 最後利用replace()方法使用RegEx 將所有%符號移除
    var pos = str.indexOf("https%3A%2F%2Fhackmd.io%2F");
    str = str.slice(pos);
    str = str.replace(/%/g, "");
    // javascript - Get element from within an iFrame - Stack Overflow
    // https://stackoverflow.com/questions/1088544/get-element-from-within-an-iframe
    // 從iframe 的id 取回裡面的內容
    return document.getElementById(str);
}

var myFrame = getframe();

//===============
// trigger click to download .md file event from bookmode iframe element
//===============
function triggerDownload(Frame) {
    var innerDoc = Frame.contentDocument || Frame.contentWindow.document;
    // HTML DOM getElementsByClassName() Method
    // https://www.w3schools.com/jsref/met_document_getelementsbyclassname.asp
    // 從iframe 取回的內容找到"ui-download-markdown"類別
    // x 包含兩個物件，我們要的是第二個x[1]
    var x = innerDoc.getElementsByClassName("ui-download-markdown");
    //How to trigger event in JavaScript? - Stack Overflow
    //https://stackoverflow.com/questions/2490825/how-to-trigger-event-in-javascript
    // 模仿按下下載連結時觸發click event
    var event = new CustomEvent('click', {
        bubbles: true,
        cancelable: true
    });
    x[1].dispatchEvent(event);
}



//============
// go to next page link callback function
//============
function gotoNextLink(unregister, eventHandler) {

    if (myLink.length == 0) {
        unregister(eventHandler);
        return;
    }

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

}


//=============
// unregister onload event while no further pages
//=============
// jquery - Javascript - Cancel onload event - Stack Overflow
// https://stackoverflow.com/questions/3717205/javascript-cancel-onload-event
function onloadUnregister(onloadHandler) {
    onloadHandler = null;
}

//=============
// register onload event to the current bookmode content iframe
//=============
// javascript - How to execute a function when page has fully loaded? - Stack Overflow
// https://stackoverflow.com/questions/1033398/how-to-execute-a-function-when-page-has-fully-loaded
//
// javascript - Capture iframe load complete event - Stack Overflow
// https://stackoverflow.com/questions/3142837/capture-iframe-load-complete-event
//
// html - JavaScript that executes after page load - Stack Overflow
// https://stackoverflow.com/questions/807878/javascript-that-executes-after-page-load
//
myFrame.onload = function () {
    // Window setTimeout() Method
    // https://www.w3schools.com/jsref/met_win_settimeout.asp
    //
    setTimeout(function(){
        if (!isManual) {
            triggerDownload(myFrame);
        }else{
            isManual = false;
        }
        gotoNextLink(onloadUnregister, myFrame.onload);
    }, 2000);
};

//===========
// trigger the onload event of the current bookmode content iframe
//===========
// Force a window.onload event in javascript - Stack Overflow
// https://stackoverflow.com/questions/9642823/force-a-window-onload-event-in-javascript
//
// Creating and triggering events - Web developer guides | MDN
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
//
isManual = true; // to avoid duplicate download
myFrame.dispatchEvent(new Event('load'));
