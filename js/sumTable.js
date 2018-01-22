jQuery.fn.extend({
  sumTable : function (settings) 
  {
	  var space = settings["tot_in"]-1;
	  var title = settings["tot_title"];
	  var index1 = settings["index"].split(',');
	  var color = settings["color"];
    var skipFirstCol = (settings["skipFirstColumn"] == true || settings["skipFirstColumn"] == false) ? settings["skipFirstColumn"] : false;
    var totalText = (typeof settings["totalText"] != "undefined") ? settings["totalText"] : "Total";
    var totalClass = (typeof settings["totalClass"] != "") ? settings["totalClass"] : "";
    var tableSize = $.parseHTML($("tbody", this).html().replace(/\s+/g, ''))[0].childElementCount;
    var len = (skipFirstCol == true) ? tableSize: tableSize;
    var data = new Array(len).fill(0);
    var indexIndent = (skipFirstCol == true) ? 1 : 0;
    var html = "";
	
    $.each($.parseHTML($("tbody", this).html().replace(/\s+/g, '')), function (index)
 	{
		$ss = 0;
		
      $.each($.parseHTML($(this).html()), function (index) {
		  
		  if($(this).html() != "")
			  {
				  $data = $(this).html();
			  }
			  else 
			  {
				  $data = "";
			  }
        /*if (skipFirstCol == true) {
          if (index != 0) {
            data[index] += parseFloat($data);
          }
        } else {
          data[index] += parseFloat($data);
        }*/
		//alert(index1[$ss] + "=" + index);
		if(index1[$ss] == index)
		{
			data[index] += parseFloat($data);
			$ss++;
		}
		
		 
      });
	 
    });
	
	
	
    $.each(data, function (index) {
		if(isNaN(data[index]) || data[index] == 0)
		{
			$val = "";
		}
		else
		{
			$val = data[index].toFixed(2);
			
		}
		if(space == index)
		{
			$val = title;
		}
      html += "<td style='font-weight:bold'>" + $val + "</td>";
    });
	
    $(this).append(
      (skipFirstCol == true) ? "<tr style='color:"+color+"' class='" + totalClass + "'>" + html + "</tr>" : "<tr style='color:"+color+"'>" + html + "</tr>"
    );
  }
});
