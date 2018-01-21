// demo: https://github.com/bitcoinj-cash/bitcoinj/blob/cash-0.14/examples/src/main/javascript/forwarding.js
//       https://github.com/bitcoinj-cash/bitcoinj/blob/cash-0.14/examples/src/main/javascript/demo.js
// ---

// Creates minimal BIP70 payment request and then prints to base64
// https://github.com/bitcoinj-cash/bitcoinj

var bcj = org.bitcoinj;
var protos = org.bitcoin.protocols.payments.Protos;
var pbuf = com.google.protobuf;

var details = protos.PaymentDetails.newBuilder();
details.time = new Date().value;
var output = protos.Output.newBuilder();

var scriptBytes = bcj.script.ScriptBuilder.createMultiSigOutputScript(2, [new bcj.core.ECKey(), new bcj.core.ECKey()]).program;
// ... or to a regular address output:
// var scriptBytes = bcj.script.ScriptBuilder.createOutputScript(new bcj.core.ECKey().toAddress(bcj.params.MainNetParams.get())).program;

output.script = pbuf.ByteString.copyFrom(scriptBytes);
details.addOutputs(output);

var request = protos.PaymentRequest.newBuilder();
request.serializedPaymentDetails = details.build().toByteString();

var bits = request.build().toByteArray();
// var myAddr = wallet.currentReceiveAddress()
var myAddr = java.util.Base64.getEncoder().encodeToString(bits);
var uri = "bitcoincash:" + myAddr;
//print(myAddr);

print("Send coins to: " + myAddr);
print("QRcode: http://qrickit.com/api/qr?d=" + uri);