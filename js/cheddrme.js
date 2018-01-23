/********************************************************************
    cheddr.js
    v.0.0.5
    github.com/stabwah/cheddrme
********************************************************************/

// 'url': 'https://api.coinbase.com/v2/exchange-rates?currency=BCH',
// 'price_key': 'data.rates.{cur}',

/* from https://github.com/simon-v/minipos/blob/master/bch.py

'url': 'https://blockdozer.com/insight-api/addr/bitcoincash:{address}',
		'balance_key': 'balance',
		'confirmed_key': None,
		'unconfirmed_key': 'unconfirmedBalance',
		'unit_satoshi': False,
        'prefixes': 'qp',

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

function updateFiatSymbol() {
    var currency_symbols = {
        'AUD': '$', 
        'USD': '$', 
        'EUR': '€', 
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', 
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    };

    if (currency_symbols[fiat] !== undefined) {
        fiatSymbol = currency_symbols[fiat];
    } else {
        fiatSymbol = "$";
    }    
    $("#displayFiat").text(fiat);
    $("#fiatSymbol").text(fiatSymbol);
}

function resetOrderForm() {
    $("#paymentSummary").hide();
    $("#orderedItems").find("tr").remove();
    $("#paymentCode").empty();
    $("#itemList").show();
    updateTotals();
}

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

// add thousands seperator to number
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

// get exchange rate
getExchRate = function (fiat) {
    $.get("https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/?convert=" + fiat)
    .then( function (data, status) {
    var dateVar = "2010-10-30";
    var exchangeUpdated = new Date(dateVar);
    var local = fiat.toString().toLowerCase();
    currentExchangeRate = data[0]['price_' + local];    
    if (currentExchangeRate > 0) {
        toastr.info('1 BCH = ' + fiatSymbol + parseFloat(currentExchangeRate).toFixed(2));
        transFee = parseFloat(transFeeBCH * currentExchangeRate);
        transFeeBits = parseFloat(transFeeBCH * 1000000).toFixed(2);
        $("#transactionFee").text("Recommended transaction fee: ");
        $("#transFeeRecommended").text(transFeeBits);
        $("#transactionFeeFiat").text(fiatSymbol + transFee.toFixed(4));
    } else { 
        toastr.error("Could not retrieve exchange rate");
    } })
    .fail( function() {
        toastr.error("Could not retrieve exchange rate");
    });
};

// update POS display
updateScreen = function (displayValue) {
    var displayValue = displayValue.toString();
    $('#display').val(displayValue.substring(0, 10));
};

// alternating table row colours
updateTable = function () {
    $('table').each(function() {
        $('tr:even',  this).addClass('primary');
        $('tr:odd', this).removeClass('primary');
    });
};

// calculate totals
updateTotals = function () {
    updateTable();
    var finalTotalBits = 0;
    $(".orderPriceBits").each(function() {
        orderPriceB = $(this).text().replace(',', '');
        finalTotalBits += parseFloat(orderPriceB);
    });
    $("#orderTotalBits").text(thousands(finalTotalBits.toFixed(2)));

    var finalTotalFiat = 0;
    $(".orderPriceFiat").each(function() {
        orderPriceText = $(this).text().replace(fiatSymbol, '');
        finalTotalFiat += parseFloat(orderPriceText);
    });
    $("#orderTotalFiat").text(fiatSymbol + finalTotalFiat.toFixed(2));

    finalTotalBCH = finalTotalBits / 1000000;
    $("#orderTotalBCH").text('(₿' + finalTotalBCH.toFixed(8) + ')');
};

// check if address already exists in list
dupeAddress = function (input) {
    var newAdd = input;
    var dupesExist = $("#myAddresses").find('.addedAddress').text();
    if(dupesExist.length > 1) {
        $(".addedAddress").each(function() {
            testAdd = $(this).text();
            if (newAdd === testAdd) {
                console.log('exists:' + testAdd);
                return 1;
            } else {
                console.log('no dupe!');
                return 0;
            }
        });
    } else {
        return 0;
    }
};

// Retrieve list of recieve addresses (so we can rotate later)
getAddressList = function() {
    $(".addedAddress").each(function() {
        testAdd = $(this).text();
    });
};

// is a variable a number?
isNumber = function (value) {
    return !isNaN(value);
};