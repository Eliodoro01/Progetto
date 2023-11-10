<!DOCTYPE html>
<html>
<head>
<title>Informazioni Treni Demo</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="css/bootstrap.min.css" rel="stylesheet">
<link href="css/datepicker3.css" rel="stylesheet">
</head>
<body>
<div class="container">

<br/>
<br/>
<div class="row">
	<div class="col-md-2"><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseCercaViagio">Cerca Viaggio</button></div>
	<div class="col-md-3"><button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapsePartArrStazione">Partenze e Arrivi Stazione</button></div>
</div>
<br/>
<br/>

<div class="collapse" id='collapsePartArrStazione'>
	<div class="row">
		<div class="col-md-2">Nome Stazione:</div>
		<div class="col-md-3"><input class="form-control stazionePartenza" type='text' /></div>
		<div class="col-md-1"><button class="btn btn-primary searchButton subA">Cerca</button></div>
		<div class="col-md-1"><button data-target='stazionePartenza' class="btn btn-danger resetInfo">Reset</button></div>
	</div>
	<div class="row">
		<div class="col-md-2 "><button id='searchParArrSta' class="btn btn-success">Cerca Viaggio</button></div>
	</div>
	<br/>
	<br/>
	<div id='showContentPaArSta'></div>
</div>

<div class="collapse" id='collapseCercaViagio'>
	<div class="row">
		<div class="col-md-2">Stazione Partenza:</div>
		<div class="col-md-3"><input class="form-control stazionePartenza" type='text' /></div>
		<div class="col-md-1"><button class="btn btn-primary searchButton subA">Cerca</button></div>
		<div class="col-md-1"><button data-target='stazionePartenza' class="btn btn-danger resetInfo">Reset</button></div>
	</div>
	
	<div class="row">
		<div class="col-md-2">Stazione Arrivo:</div>
		<div class="col-md-3"><input class="form-control stazioneArrivo" type='text' /></div>
		<div class="col-md-1"><button class="btn btn-primary searchButton subB">Cerca</button></div>
		<div class="col-md-1"><button data-target='stazioneArrivo' class="btn btn-danger resetInfo">Reset</button></div>
	</div>
	<br/>
	<div class="row">
		<div class="col-md-2">Data:</div>
		<div class="col-md-3"><input id='datapicker' class="form-control" type='text' /></div>
	</div>
	<br/><br/>
	<div class="row">
		<div class="col-md-1">Ora</div>
		<div class="col-md-1">
				<select id='orPartenza' class="form-control">
					<option value='00'>00</option>
					<option value='01'>01</option>
					<option value='02'>02</option>
					<option value='03'>03</option>
					<option value='04'>04</option>
					<option value='05'>05</option>
					<option value='06'>06</option>
					<option value='07'>07</option>
					<option value='08'>08</option>
					<option value='09'>09</option>
					<option value='10'>10</option>
					<option value='11'>11</option>
					<option value='12'>12</option>
					<option value='13'>13</option>
					<option value='14'>14</option>
					<option value='15'>15</option>
					<option value='16'>16</option>
					<option value='17'>17</option>
					<option value='18'>18</option>
					<option value='19'>19</option>
					<option value='20'>20</option>
					<option value='21'>21</option>
					<option value='22'>22</option>
					<option value='23'>23</option>
			</select>
		</div>
		<div class="col-md-1">Minuti</div>
		<div class="col-md-1">
			<select id='miPartenza' class="form-control"> 
					<option value='00'>00</option>
					<option value='10'>10</option>
					<option value='20'>20</option>
					<option value='30'>30</option>
					<option value='40'>40</option>
					<option value='50'>50</option>
			</select>
		</div>
	</div>
	<br/>
	<br/>
	<div class="row">
		<div class="col-md-2 "><button id='cercaViaggio' class="btn btn-success">Cerca Viaggio</button></div>
	</div>
	<br/>
	<br/>
	<div id='showContentViaggi'></div>
</div>
<script src='js/jq.js'></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/bootstrap-datepicker.js"></script>
<script>
$(document).ready(function(){
	$('#datapicker').datepicker({
		format: "yyyy-mm-dd",
		startDate: "-0d",
		language: "it",
		autoclose: true,
		todayHighlight: true
	});
	
	$('.subA, .subB').on('click',function(){
			var inId=($(this).hasClass('subA'))? 'stazionePartenza':'stazioneArrivo',
				st=$(this).parent().parent().find('.'+inId).val().replace(/^\s*|\s*$/gmi, ''),
				button=$(this);
			if(st.replace(/^\s*|\s*$/gmi, '')){
				$.ajax({
					type: 'POST',
					url: 'php/call.php',
					data: {'act':'completeIn',stringaStazione:st},
					dataType:"json",
					success : function (a) {
						var l=a.length,
							selDom=[];

						selDom.push('<select class="form-control '+inId+'" >');
						for(var i=0; i<l; i++){
							selDom.push("<option value='"+a[i][1]+"'>"+a[i][0]+"</option>");
						}
						selDom.push('</select>');
						selDom=selDom.join('');
						button.parent().parent().find('.'+inId).replaceWith(selDom);
						button.attr('disabled','disabled');
					}
				}).fail(function(jqXHR, textStatus){alert('errore:'+textStatus)});
			}
	});

});

$('.resetInfo').on('click', function(){
	var id=$(this).attr('data-target');
	$(this).parent().parent().find('.'+id).replaceWith("<input class='form-control "+id+"' type='text' />");
	$(this).parent().parent().find('.searchButton').removeAttr('disabled');
});

$('#cercaViaggio').on('click', function(){
	
	var staP=parseInt($(this).parent().parent().parent().find('select.stazionePartenza').val().replace(/[\D]/gmi, '').replace(/^\s*|\s*$/gmi, '')),
		staA=parseInt($(this).parent().parent().parent().find('select.stazioneArrivo').val().replace(/[\D]/gmi, '').replace(/^\s*|\s*$/gmi, '')),
		dataP=$('#datapicker').val().replace(/^\s*|\s*$/gmi, ''),
		orPartenza=$('#orPartenza').val().replace(/[\D]/gmi, '').replace(/^\s*|\s*$/gmi, ''),
		miPartenza=$('#miPartenza').val().replace(/[\D]/gmi, '').replace(/^\s*|\s*$/gmi, '');

	if(!dataP.match(/^(19|20)\d\d[- \/.](0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])$/gmi, '')){
		alert('Invalid Date');
		return;
	}

	if(staP && staA && dataP && orPartenza && miPartenza){
		dataP=dataP+'T'+orPartenza+':'+miPartenza+':00';

		$.ajax({
				type: 'POST',
				url: 'php/call.php',
				data: {'act':'cercaViaggio',staP:staP,staA:staA,dataP:dataP},
				dataType:"json",
				success : function (a) {
					var l=a.length,
						selDom=[];

					selDom.push('<table class="table table-hover ElencoOpzioni"><thead><tr><td>#</td><td>Durata</td><td>Partenza</td><td>Arrivo</td><td>Orario Partenza</td><td>Orario Arrivo</td><td>Numero Treno</td></tr></thead><tbody>');
					for(var i=0; i<l; i++){
						selDom.push("<tr><td>"+a[i][0]+"</td><td>"+a[i][1]+"</td><td>"+a[i][2]+"</td><td>"+a[i][3]+"</td><td>"+a[i][4]+"</td><td>"+a[i][5]+"</td><td>"+a[i][6]+"</td></tr>");
					}
					selDom.push('</tbody></table>');
					selDom=selDom.join('');
					
					$('#showContentViaggi').html(selDom);
				}
			}).fail(function(jqXHR, textStatus){alert(textStatus)});	
	}
});

$('#searchParArrSta').on('click', function(){
	var staP=parseInt($(this).parent().parent().parent().find('select.stazionePartenza').val().replace(/[\D]/gmi, '').replace(/^\s*|\s*$/gmi, '')),
		tz=new Date().toString().match(/([A-Z]+[\+-][0-9]+)/)[1];
	if(staP){
		$.ajax({
				type: 'POST',
				url: 'php/call.php',
				data: {'act':'partenzeArriviStazione',staP:staP,tz:tz},
				dataType:"json",
				success : function (a) {
					/*var l=a['Arrivi'].length,
						selDom=[];

					selDom.push('<p>Arrivi</p><table class="table table-hover ElencoOpzioni"><thead><tr><td>#</td><td>numeroTreno</td><td>Partenza</td><td>Arrivo</td><td>Orario Partenza</td><td>Orario Arrivo</td><td>Numero Treno</td></tr></thead><tbody>');
					for(var i=0; i<l; i++){
						selDom.push("<tr><td>"+a['Arrivi'][i][0]+"</td><td>"+a['Arrivi'][i][1]+"</td><td>"+a['Arrivi'][i][2]+"</td><td>"+a['Arrivi'][i][3]+"</td><td>"+a['Arrivi'][i][4]+"</td><td>"+a['Arrivi'][i][5]+"</td><td>"+a['Arrivi'][i][6]+"</td></tr>");
					}
					selDom.push('</tbody></table>');
					
					l=a['Partenze'].length;
					selDom.push('<p>Partenze</p><table class="table table-hover ElencoOpzioni"><thead><tr><td>#</td><td>numeroTreno</td><td>Arrivo</td><td>Orario Partenza</td><td>Orario Arrivo</td><td>Numero Treno</td></tr></thead><tbody>');
					for(var i=0; i<l; i++){
						selDom.push("<tr><td>"+a['Partenze'][i][0]+"</td><td>"+a['Partenze'][i][1]+"</td><td>"+a['Partenze'][i][2]+"</td><td>"+a['Partenze'][i][3]+"</td><td>"+a['Partenze'][i][4]+"</td><td>"+a['Partenze'][i][5]+"</td><td>"+a['Partenze'][i][6]+"</td></tr>");
					}
					selDom.push('</tbody></table>');

					$('#showContentViaggi').html(selDom);*/
				}
			}).fail(function(jqXHR, textStatus){alert(textStatus)});	
	}
});
</script>
</div>
</body>
</html>