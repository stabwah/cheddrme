/********************************************************************
    cheddr.js
    v0.8
    github.com/stabwah/cheddrme
********************************************************************/

/*  
    maybe one day
    https://bitcoincash.blockexplorer.com/api/addr/1HMFfEwYv6M4qMsKa2d7eQbFBtF4e4dFWk -- doesnt support cashaddr
    https://cashexplorer.bitcoin.com/api/addr/1HMFfEwYv6M4qMsKa2d7eQbFBtF4e4dFWk -- doesn't support cashaddr

    https://bch-chain.api.btc.com/v3/address/1HMFfEwYv6M4qMsKa2d7eQbFBtF4e4dFWk -- doesnt support cashaddr, not insight api

following taken from https://github.com/simon-v/minipos/blob/master/bch.py
    'url': 'https://api.coinbase.com/v2/exchange-rates?currency=BCH',
    'price_key': 'data.rates.{cur}',
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

var totalToday = 0;

toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-left",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "150",
    "hideDuration": "1500",
    "timeOut": "3000",
    "extendedTimeOut": "1500",
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
    
    $("#donateModal").hide();
    $("#settingsModal").hide();
    resetOrderForm();
    $("#mainForm").hide();
    $("#menubar").hide();
    $("#cheddrFooter").show();    
    $("#qrbch").hide();
}

function showMain() {
    var checkFiatRate = $("#splashRate").val();
    if(checkFiatRate === -1) {
        getExchRate(fiat);
    } else {
        // only updated every 5 mins anyway
        getExchRate(fiat);

        $("#mainForm").show();
        $("#menubar").show();
        $(".keypad").show();
        $("#menubar").show();
        $("#inputFields").show();
        $("#orderFooter").addClass("columns");
        $("#orderFooter").removeClass("rows");
        $("#settingsModal").hide(); 
        $("#donateModal").hide();
        $("#cheddrFooter").hide();

        $("#storeSplash").hide();
        $("#settingsModal").hide(); 
        $("#donateModal").hide();
        $("#cheddrFooter").hide();
        $("#qrbch").hide();
        updateScreen(0);
        resetOrderForm();
    }
}

function showSettings() {
    $("#storeSplash").hide();
    $("#settingsModal").show();
    $("#donateModal").hide();
    $("#cheddrFooter").show();
    $("#qrbch").hide();

    var checkSaved = localStorage.getItem("cheddrAddress");
    if (checkSaved != null) {
      // found saved address
      //$("#myAddresses").empty();
    /*  $("#myAddresses").append('<div><span class="addedAddress">' + checkSaved +
              '</span><span>&nbsp;<a href="#" class="removeAddress"><i class="fi-trash removeAddress"></i></a></span></div>'); */
    } 

    var checkStore = localStorage.getItem("cheddrStoreName");
    if (checkStore != null) {
        $("#inputStoreName").text(checkStore);
        $("#splashStoreName").text(checkStore);
    }

    var checkPrint = localStorage.getItem("cheddrPrintPref");
    if (checkPrint === "Always") {
        $("#settingsPrint").val("Always");
    } else {
        $("#settingsPrint").val("Manual");
    }

    $("#mainForm").hide();
    $("#menubar").hide();
}

function resetOrderForm() {
    $("#paymentSummary").hide();
    $("#summaryQrCode").show();
    $("#summaryFeeRecommend").show();
    $("#summaryWaiter").hide();
    $("#summaryWaiterText").hide();
    $("#orderCancel").show();
    $("#orderDone").show();     
    $("#orderedItems").find("tr").remove();
    $("#paymentCode").empty();
    $("#itemList").show();
    $("#orderFooter").show();

    if (savedSalesTax > 0) {
        $("#orderSubTotal").show();
        $("#orderSalesTax").show();
    } else { 
        $("#orderSalesTax").hide();
        $("#orderSubTotal").hide();
    }

    if (savedDiscount > 0) {
        $("#orderSubTotal").show();
        $("#orderDiscount").show();
    } else {
        $("#orderDiscount").hide();
        $("#orderSubTotal").hide();
    }

    updateTotals();
}

function orderPrint() {
    var salesTax = savedSalesTax;
    var bchDiscount = savedDiscount;
    var salesTaxFiat = $("#orderSalesTaxFiat").text();
    var salesTaxBits = $("#orderSalesTaxBits").text();
    var bchDiscountFiat = $("#orderDiscountFiat").text();
    var bchDiscountBits = $("#orderDiscountBits").text();
    var subTotalFiat = $("#orderSubTotalFiat").text();
    var subTotalBits = $("#orderSubTotalBits").text();
    var finalTotalBits = $("#orderTotalBits").text();
    var checkStore = localStorage.getItem("cheddrStoreName");
    var timeNow = new Date($.now());

    var htmlHeader = '<div id="cheddrInvoice"><center id="cheddrInvoiceHeader"><div class="logo"><img src="images/receiptLogo.png" width="120px" height="120px"></div><div class="info"><h2>' + checkStore + '</h2></div></center><hr><div id="cheddrInvoiceSubHeader"><div class="info"><p>' + uuid() + '<br/>' + timeNow.toLocaleString() + '</p></div></div><br/>';
    var htmlBody = '<div id="cheddrInvoiceBody"><div id="table"><table><tr class="invoiceTitle"><td class="itemHeader"><h2>Item</h2></td><td class="fiatHeader"><h2>Price ($)</h2></td><td class="bitsHeader"><h2>Price (bits)</h2></td></tr>';
    var htmlTotals = '<tr class="invoiceTotal"><td>Total</td><td class="totalFiat"><h2>' + fiatSymbol + finalTotal + '</h2></td><td class="totalBits"><h2>' + finalTotalBits + '</h2></td></tr>';
    var htmlFooter = '</table></div><div id="docketThankyou"><p class="docketThankyou"><strong>Thanks for your purchase!</strong></p></div><hr><div class="totalBCH"><img id="cheddrInvoiceFooter" src="images/bchlogoprint.png" height="64px"><h2>₿' + finalTotalBCH  + '</h2></div><div class="docketFooter">Sent To:</div><div class="docketAddress">' + paymentAddress + '</div></div><hr><div class="docketFooter">cheddr pos 0.8 alpha<br/> https://pos.cheddr.cash<br/> Proudly powered by Bitcoin Cash</div></div>';

    $("#orderFooter").hide();
    $(".keypad").hide();
    $("#paymentTitle").hide();
    $("#paymentSummary").hide();
    $("#menubar").hide();
    $("#inputFields").hide();
    $("#summaryQrCode").hide();
    $("#summaryFeeRecommend").hide();
    $("#summaryWaiter").hide();
    $("#summaryWaiterText").hide();
    $("#storeSplash").hide();
    $("#settingsModal").hide(); 
    $("#donateModal").hide();
    $("#cheddrFooter").hide();

    var htmlTableRows = "";
    $("#orderedItems").find('tr').each(function (i, el) {
        var $tds = $(this).find('td'),
            printItemName = $tds.eq(0).text(),
            printItemPriceFiat = $tds.eq(1).text(),
            printItemPriceBits = $tds.eq(2).text();
            htmlTableRows += '<tr class="invoiceItemList"><td class="itemName">' + printItemName + '</td><td class="itemPriceFiat">' + printItemPriceFiat + '</td><td class="itemPriceBits">' + printItemPriceBits + '</td></tr>';
    });

    var html = htmlHeader + htmlBody + htmlTableRows;
    if (salesTax > 0 || bchDiscount > 0) {
        var htmlSubTotal = '<tr class="invoiceSubTotal"><td>Sub-Total</td><td class="subTotalFiat"><h2>' + subTotalFiat + '</h2></td><td class="subTotalBits"><h2>' + subTotalBits + '</h2></td></tr>';
        html += htmlSubTotal;
    }
    if (salesTax > 0) {
        var htmlSalesTax = '<tr class="invoiceSalesTax"><td>Sales Tax</td><td class="salesTaxFiat"><h2>' + salesTaxFiat + '</h2></td><td class="salesTaxBits"><h2>' + salesTaxBits + '</h2></td></tr>';
        html += htmlSalesTax;
    }
    if (bchDiscount > 0) {
        var htmlDiscount = '<tr class="invoiceDiscount"><td>Bitcoin Cash Discount</td><td class="bchDiscountFiat"><h2>' + bchDiscountFiat + '</h2></td><td class="bchDiscountBits"><h2>' + bchDiscountBits + '</h2></td></tr>';
        html += htmlDiscount;
    }

    html += htmlTotals + htmlFooter;
    $('body').prepend(html);
    toastr.remove();

    window.print();

    $("#cheddrInvoice").remove();
}

// splash page time display
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

// update local currency symbol
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
                $("#splashNewPayment").removeClass("disabled");
                toastr.success('1 BCH = ' + fiatSymbol + parseFloat(currentExchangeRate).toFixed(2));

                var splashUpdate = fiatSymbol + parseFloat(currentExchangeRate).toFixed(2) + '<br/>' + fiat + ' / BCH';
                $("#splashRate").empty();
                $("#splashRate").append(splashUpdate);

                transFee = parseFloat(transFeeBCH * currentExchangeRate);
                transFeeBits = parseFloat(transFeeBCH * 1000000).toFixed(2);
                $("#transactionFee").text("Recommended transaction fee ");
                $("#transFeeRecommended").text(transFeeBits);
                $("#transactionFeeFiat").text(fiatSymbol + transFee.toFixed(4));
            } else { 
                getExchRateFallback(fiat);
            }
        })
        .fail( function() {
            getExchRateFallback(fiat);
        });
    } 
};

// get exchange rate fallback
getExchRateFallback = function (fiat) {
    var url = "https://min-api.cryptocompare.com/data/price?fsym=BCH&tsyms=" + fiat; 
    exchangeUpdated = new Date($.now());
    $.get(url)
    .success( function (fallbackdata) {
        var local = fiat.toString().toLowerCase();
        currentExchangeRate = fallbackdata[fiat];    
        if (currentExchangeRate > 0) {
            $("#splashNewPayment").removeClass("disabled");
            toastr.success('1 BCH = ' + fiatSymbol + parseFloat(currentExchangeRate).toFixed(2));

            var splashUpdate = fiatSymbol + parseFloat(currentExchangeRate).toFixed(2) + '<br/>' + fiat + ' / BCH';
            $("#splashRate").empty();
            $("#splashRate").append(splashUpdate);

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
};

// get wallet details
getInitials = function (url) {
    $.get(url)
    .success( function(inData) {
          var intialUpdated = new Date($.now());
          initialBalance = inData["balance"];
          initialBalanceSat = inData["balanceSat"];
          initialUnBalance = inData["unconfirmedBalance"]; // totalReceived
          initialUnBalanceSat = inData["unconfirmedBalanceSat"]; 
          initialTxArrivals = inData["unconfirmedTxApperances"];
          initialTotal = parseFloat(initialBalance + initialUnBalance).toFixed(8);
          $("#orderDone").removeClass("disabled");
          console.log("initial::" + initialTotal);
          clearInterval(intervalRateLimit);
        }, "json" )
    .fail( function() {
        toastr.error("Couldn't retrieve transaction details");
    });
};

// check transaction
checkTransaction = function (url, orderTotalBCH) {
    expectedTotal = parseFloat(initialBalance) + parseFloat(orderTotalBCH);
    expectedTotal = parseFloat(expectedTotal).toFixed(8);
    $.get(url)
    .success( function(chkData) {
        var transactionStart = new Date($.now());
        currentBalance = chkData["balance"];
        currentBalanceSat = chkData["balanceSat"];
        currentUnBalance = chkData["unconfirmedBalance"];
        currentUnBalanceSat = chkData["unconfirmedBalanceSat"];
        currentTxArrivals = chkData["unconfirmedTxApperances"];
        currentTotal = parseFloat(currentBalance + currentUnBalance).toFixed(8);
        if (currentTotal >= expectedTotal) {                    // && currentTxArrivals = initialTxArrivals + 1 TODO
            // stop checking api
            clearInterval(intervalRateLimit);
            totalToday = (totalToday + orderTotalBCH);
            $(".circle-loader").toggleClass("load-complete");
            $(".checkmark").toggle();      
            toastr.success("Payment recieved!");
            $("#splashStatus").text('Total: ₿' + parseFloat(totalToday).toFixed(8));
            $("#splashStatusDate").empty();
            $("#splashStatusDate").append('Last Transaction:<br/>₿' + parseFloat(orderTotalBCH).toFixed(8) + '<br/>' + transactionStart.toLocaleTimeString());
            // wait for tick animation (800ms)
            setTimeout(                     
                function() 
                {
                    var printState = $("#orderPrint").hasClass("hollow"); 
                    if(printState) {        // printing is disabled
                        showSplash();
                    } else {
                        orderPrint();       // print receipt 
                        showSplash();
                    }
                }, 900);
        } else {
            console.log("current::" + currentTotal);
            console.log("expected::" + expectedTotal);
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

// alternating table row colours
updateTable = function () {
    $('table').each(function() {
        $('tr:even',  this).addClass('primary');
        $('tr:odd', this).removeClass('primary');
    });
};

// add item to order list
addItemToOrder = function(itemName = "") {
    var itemPrice = parseFloat($("#mainDisplay").val()).toFixed(2);
    var itemPriceBCH = 0;

    if (itemPrice > 0) {       
        itemPriceBCH = parseFloat(itemPrice / currentExchangeRate).toFixed(8);
        itemPriceBits = parseFloat(itemPriceBCH * 1000000).toFixed(2);

        $("#orderedItems").append(
        '<tr class="orderItem"><td>' + 
        itemName + '&nbsp;&nbsp;<a href="#" class="editRow"><i class="fi-pencil"></i></a>&nbsp;&nbsp;<a href="#" class="deleteRow"><i class="fi-trash"></i></a></td><td class="orderPriceFiat">' +
        fiatSymbol + ' ' + itemPrice + '</td><td class="orderPriceBits">' + thousands(itemPriceBits) +
        '</td></tr>');
        $("#itemList").scrollTop($("#itemList")[0].scrollHeight);

        updateTotals();
        updateScreen(0);
    }
};

// calculate totals
updateTotals = function () {
    var salesTaxFiat = 0;
    var salesTaxBits = 0;
    var bchDiscountFiat = 0;
    var bchDiscountBits = 0;
    var subTotalFiat = 0;
    var subTotalBits = 0;
    var finalTotalBits = 0;
    var finalTotalFiat = 0;

    updateTable();

    // calculate sub total bits
    $(".orderPriceBits").each(function() {
        orderPriceB = $(this).text().replace(',', '');
        subTotalBits += parseFloat(orderPriceB);
    });

    // calculate sub total fiat
    $(".orderPriceFiat").each(function() {
        orderPriceText = $(this).text().replace(fiatSymbol, '');
        subTotalFiat += parseFloat(orderPriceText);
    });

    // add sales tax
    var salesTax = savedSalesTax;
    if (savedDiscount > 0) {
        salesTax = parseFloat(salesTax / 100).toFixed(2);
        salesTaxFiat = parseFloat(subTotalFiat * salesTax).toFixed(2);
        salesTaxBits = parseFloat(subTotalBits * salesTax).toFixed(2);
        $("#orderSalesTaxText").text("Sales Tax (" + (salesTax * 100) + "%)");
        $("#orderSalesTaxFiat").text(fiatSymbol + salesTaxFiat);
        $("#orderSalesTaxBits").text(thousands(salesTaxBits));
    } 

    // apply discount (yay!)
    var bchDiscount = savedDiscount;
    if (bchDiscount > 0) {
        bchDiscount = parseFloat(bchDiscount / 100).toFixed(2);
        bchDiscountFiat = parseFloat(subTotalFiat * bchDiscount).toFixed(2);
        bchDiscountBits = parseFloat(subTotalBits * bchDiscount).toFixed(2);
        $("#orderDiscountText").text((bchDiscount * 100) + "% Discount!");
        $("#orderDiscountFiat").text(fiatSymbol + bchDiscountFiat);
        $("#orderDiscountBits").text(thousands(bchDiscountBits));
    }

    subTotalFiat = parseFloat(subTotalFiat).toFixed(2);
    subTotalBits = parseFloat(subTotalBits).toFixed(2);
    // calculate total bits
    finalTotalBits = parseFloat(parseFloat(subTotalBits) + parseFloat(salesTaxBits) - parseFloat(bchDiscountBits)).toFixed(2);
    // calculate total fiat
    finalTotalFiat = parseFloat(parseFloat(subTotalFiat) + parseFloat(salesTaxFiat) - parseFloat(bchDiscountFiat)).toFixed(2);
    // convert total BCH
    finalTotalBCH = parseFloat(finalTotalBits / 1000000).toFixed(8);
    finalTotal = finalTotalFiat;

    $("#orderSubTotalFiat").text(fiatSymbol + subTotalFiat);
    $("#orderTotalFiat").text(fiatSymbol + finalTotalFiat);
    $("#orderSubTotalBits").text(thousands(subTotalBits));
    $("#orderTotalBits").text(thousands(finalTotalBits));
    $("#orderTotalBCH").text('(₿' + finalTotalBCH + ')');
};


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

//  RFC4122 version 4 compliant UUID
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    })
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

// time math
function diff_minutes(dt2, dt1) {
  var diff=(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

// is a variable a number?
isNumber = function (value) {
    return !isNaN(value);
};
