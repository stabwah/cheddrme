// 'url': 'https://api.coinbase.com/v2/exchange-rates?currency=BCH',
// 'price_key': 'data.rates.{cur}',

/* from https://github.com/simon-v/minipos/blob/master/bch.py

'url': 'https://cashexplorer.bitcoin.com/api/addr/{address}',
    'balance_key': 'balance',
    'confirmed_key': None,
    'unconfirmed_key': 'unconfirmedBalance',
    'unit_satoshi': False,
    'prefixes': '13',

'url': 'https://bch-insight.bitpay.com/api/addr/{address}',
    'balance_key': 'balance',
    'confirmed_key': None,
    'unconfirmed_key': 'unconfirmedBalance',
    'unit_satoshi': False,
    'prefixes': 'CH',

'url': 'https://bch-bitcore2.trezor.io/api/addr/{address}',
    'balance_key': 'balance',
    'confirmed_key': None,
    'unconfirmed_key': 'unconfirmedBalance',
    'unit_satoshi': False,
    'prefixes': '13',
*/

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function thousands (nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

updateScreen = function (displayValue) {
    var displayValue = displayValue.toString();
    $('#display').val(displayValue.substring(0, 10));
};

updateTotals = function () {
    $('#transactionFee').text('Recommended transaction fee: ');
    $('#transFeeRecommended').text(transFeeBits);

    $("#orderSubTotalFiat").text('$' + subTotal.toFixed(2));
    $("#transactionFeeFiat").text('$' + transFee.toFixed(4));
    $("#orderTotalFiat").text('$' + finalTotal.toFixed(2));

    $("#orderSubTotalBCH").text('(₿' + subTotalBCH.toFixed(8) + ')');
    $("#orderTotalBCH").text('(₿' + finalTotalBCH.toFixed(8) + ')');

    $("#orderSubTotalBits").text(thousands(subTotalBits));
    $("#transactionFeeBits").text(thousands(transFeeBits));
    $("#orderTotalBits").text(thousands(finalTotalBits));
};

isNumber = function (value) {
    return !isNaN(value);
};