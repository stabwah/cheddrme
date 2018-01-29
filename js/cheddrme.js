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
var exchangeUpdated = null;

var initialBalance = 0;
var initialBalanceSat = 0;
var initialUnBalance = 0;
var initialUnBalanceSat = 0;
var initialTxArrivals = 0;
var initialTotal = 0;

var currentBalance = 0;
var currentBalanceSat = 0;
var currentUnBalance = 0;
var currentUnBalanceSat = 0;
var currentTxArrivals = 0;

var initialTotal = 0;
var currentTotal = 0;
var expectedTotal = 0;
var transactionTotal = 0;

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-left",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};

function showSplash() {
    $("#storeSplash").show();
    updateSplashClock();
    updateFiatSymbol();  
    getExchRate(fiat); 

    $("#settingsModal").hide();
    resetOrderForm();
    $("#mainForm").hide();
    $("#menubar").hide();
    $(".circle-loader").hide();
}

function showMain() {
    $("#mainForm").show();
    $("#menubar").show();
    $(".circle-loader").hide();
    $("#storeSplash").hide();
    $("#settingsModal").hide(); 
    updateScreen(0);
    resetOrderForm();
}

function showSettings() {
    $("#storeSplash").hide();
    $("#settingsModal").show();

    var checkSaved = localStorage.getItem("cheddrAddress");
    if (checkSaved != null) {
      // found saved address
      $("#myAddresses").empty();
      $("#myAddresses").append('<div><span class="addedAddress">' + checkSaved +
              '</span><span>&nbsp;<a href="#" class="removeAddress"><i class="fi-trash removeAddress"></i></a></span></div>');
    } 

    $("#mainForm").hide();
    $("#menubar").hide();
}

function resetOrderForm() {
    $("#paymentSummary").hide();
    $("#orderedItems").find("tr").remove();
    $("#paymentCode").empty();
    $("#itemList").show();
    updateTotals();
}

updateSplashClock = function () {
    var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]; 
    var dayNames= ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
    var newDate = new Date();
    var minutes = new Date().getMinutes();
    var hours = new Date().getHours();
  
    newDate.setDate(newDate.getDate());
  
    // update display on load
    $('#clockDisplayDate').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
    $("#clockDisplayM").html(( minutes < 10 ? "0" : "" ) + minutes);
    $("#clockDisplayH").html(( hours < 10 ? "0" : "" ) + hours);
    
    setInterval( function() {
      hours = new Date().getHours();
      minutes = new Date().getMinutes();  
      // Add leading zero
      $("#clockDisplayH").html(( hours < 10 ? "0" : "" ) + hours);
      $("#clockDisplayM").html(( minutes < 10 ? "0" : "" ) + minutes);
    }, 10000);	
  }; 

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

function diff_minutes(dt2, dt1) {
  var diff=(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

// get exchange rate
getExchRate = function (fiat) {
    var url = "https://api.coinmarketcap.com/v1/ticker/bitcoin-cash/?convert=" + fiat; 
    
    if (exchangeUpdated != null) {
        var timeNow = new Date($.now());
        var rateLimit = diff_minutes(exchangeUpdated, timeNow);
    }
    
    if (rateLimit > 5 || exchangeUpdated === null) {
        exchangeUpdated = new Date($.now());
        $.get(url)
        .success( function (data, status) {
            var local = fiat.toString().toLowerCase();
            currentExchangeRate = data[0]['price_' + local];    
            if (currentExchangeRate > 0) {
                toastr.success('1 BCH = ' + fiatSymbol + parseFloat(currentExchangeRate).toFixed(2));

                var splashUpdate = fiatSymbol + parseFloat(currentExchangeRate).toFixed(2) + '<br/>' + fiat + ' / BCH';
                $("#splashRate").empty();
                $("#splashRate").append(splashUpdate);
                $("#splashStatus").text('Updated: ' + exchangeUpdated.toLocaleString());

                transFee = parseFloat(transFeeBCH * currentExchangeRate);
                transFeeBits = parseFloat(transFeeBCH * 1000000).toFixed(2);
                $("#transactionFee").text("Recommended transaction fee: ");
                $("#transFeeRecommended").text(transFeeBits);
                $("#transactionFeeFiat").text(fiatSymbol + transFee.toFixed(4));
            } else { 
                toastr.error("Could not retrieve exchange rate");
            }
        })
        .fail( function() {
            toastr.error("Could not retrieve exchange rate");
        });
    } 
};

// get wallet details
getInitials = function () {
    var url =  "https://blockdozer.com/insight-api/addr/" + paymentAddress;

    $.get(url)
    .success( function(inData) {
          var intialUpdated = new Date($.now());
  
          initialBalance = inData["balance"];
          initialBalanceSat = inData["balanceSat"];
          initialUnBalance = inData["unconfirmedBalance"]; // totalReceived
          initialUnBalanceSat = inData["unconfirmedBalanceSat"]; 
          initialTxArrivals = inData["unconfirmedTxApperances"];
          initialTotal = initialBalance + initialUnBalance;
          console.log("in::" + initialTotal);
        }, "json" )
    .fail( function() {
        toastr.error("Couldn't retrieve transaction details");
    });
};

// check transaction
checkTransaction = function (orderTotalBCH) {
    var url = "https://blockdozer.com/insight-api/addr/" + paymentAddress;

    $.get(url)
    .success( function(chkData) {
        var transactionStart = new Date($.now());

        currentBalance = chkData["balance"];
        currentBalanceSat = chkData["balanceSat"];
        currentUnBalance = chkData["unconfirmedBalance"];
        currentUnBalanceSat = chkData["unconfirmedBalanceSat"];
        currentTxArrivals = chkData["unconfirmedTxApperances"];

        currentTotal = parseFloat(currentBalance + currentUnBalance);
        expectedTotal = parseFloat(initialBalance + orderTotalBCH);

        if (currentTotal >= expectedTotal) {
            $(".circle-loader").toggleClass("load-complete");
            $(".checkmark").toggle();      
            toastr.success("Payment recieved!");
            showSplash();
            clearInterval(intervalTransCheck);
            // showReciept()
            // record_payment(address)
            // unlock_address(address)
        } else {
            console.log("curr::" + currentTotal);
            console.log("ex::" + expectedTotal);
        }
    }, "json")
    .fail( function() {
        toastr.error("Couldn't retrieve transaction details");
    });
};

// update POS display
updateScreen = function (displayValue) {
    var display = displayValue.toString();
    currentEntry = display;
    $("#mainDisplay").val(display.substring(0, 10));
};

addItemToOrder = function() {
    var itemPrice = parseFloat($("#mainDisplay").val()).toFixed(2);
    var itemPriceBCH = 0;
    if (itemPrice > 0) {       
        subTotal = parseFloat(subTotal) + parseFloat(itemPrice);
        finalTotal = parseFloat(subTotal);

        itemPriceBCH = (parseFloat(itemPrice) / parseFloat(currentExchangeRate)).toFixed(10);
        subTotalBCH = parseFloat(subTotalBCH) + parseFloat(itemPriceBCH);
        finalTotalBCH = parseFloat(subTotalBCH);

        itemPriceBits = parseFloat(itemPriceBCH * 1000000).toFixed(2);
        subTotalBits = parseFloat(subTotalBCH * 1000000).toFixed(2);
        finalTotalBits = parseFloat(finalTotalBCH * 1000000).toFixed(2);

        $("#orderedItems").append(
        '<tr class="orderItem"><td><a href="#" class="deleteRow"><i class="fi-trash"></i></a></td><td class="orderPriceFiat">' +
        fiatSymbol + ' ' + itemPrice + '</td><td class="orderPriceBits">' + thousands(itemPriceBits) +
        '</td></tr>');
        $("#itemList").scrollTop($("#itemList")[0].scrollHeight);

        updateTotals();
        updateScreen(0);
    }
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