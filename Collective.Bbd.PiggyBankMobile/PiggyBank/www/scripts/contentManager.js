var OTP = 1234;
	function showContentClick(elem)
{
		var elementsToHide = $(elem).data("hide").split(',')
		
		for(var a = 0; a < elementsToHide.length; a++)
			{
				
					$("#" + elementsToHide[a]).hide();
			}
	var elementsToShow = $(elem).data("show").split(',')
		for(var a = 0; a < elementsToShow.length; a++)
			{
				
					$("#" + elementsToShow[a]).show();
			}


}

