<?php
/*
1)
Nell'asportazione di trucciolo abbiamo tre moti principali:
-Taglio:
-Avanzamento: portare l'utensile verso nuove zone
-Registrazione o appostamento: Apposta l'utensile in piszione reativa all'utensile
 Taglio e avanzamento sono attivi durante l'asportazione di trucciolo, il terzo invece è attivo prima della lavorazione(non si tocca col pezzo)
 
 Tornitura cilindrica esterna -> Il pezzo ruoto e riduco il diametro; il tagleinte è perpendicolare alla direazione di avanzamento

*/

if($_POST['act']=='completeIn'){
	$url='http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/autocompletaStazione/'.urlencode($_POST['stringaStazione']);

	$response = file_get_contents($url);
	$response = explode("\n",$response);
	$response = array_filter($response);
	$c=count($response);
	for($i=0;$i<$c;$i++)
		$response[$i]=explode('|',$response[$i]);
	echo json_encode($response);
	exit();
}
else if($_POST['act']=='cercaViaggio'){
	$url='http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/soluzioniViaggioNew/'.urlencode($_POST['staP']).'/'.urlencode($_POST['staA']).'/'.urlencode($_POST['dataP']);
	
	$response = file_get_contents($url);
	$response = json_decode($response);
	$c=count($response->soluzioni);
	$ret=[];
	
	for($i=0;$i<$c;$i++){
		
		$ret[]=array(
						$i+1,
						$response->soluzioni[$i]->durata,
						$response->soluzioni[$i]->vehicles[0]->origine,
						$response->soluzioni[$i]->vehicles[0]->destinazione,
						implode('<br/>',explode('T',$response->soluzioni[$i]->vehicles[0]->orarioPartenza)),
						implode('<br/>',explode('T',$response->soluzioni[$i]->vehicles[0]->orarioArrivo)),
						$response->soluzioni[$i]->vehicles[0]->numeroTreno
					);

		$cc=count($response->soluzioni[$i]->vehicles);
		if($cc>1){
			for($j=1;$j<$cc;$j++){
				$ret[]=array(
							"",
							"",
							$response->soluzioni[$i]->vehicles[$j]->origine,
							$response->soluzioni[$i]->vehicles[$j]->destinazione,
							implode('<br/>',explode('T',$response->soluzioni[$i]->vehicles[0]->orarioPartenza)),
							implode('<br/>',explode('T',$response->soluzioni[$i]->vehicles[0]->orarioArrivo)),
							$response->soluzioni[$i]->vehicles[$j]->numeroTreno
						);
			}
		}
	}	
	echo json_encode($ret);
	exit();
}
else if($_POST['act']=='partenzeArriviStazione'){
	$dateS=date('D M d Y H:i:s ').$_POST['tz'];
	
	$urlArrivi='http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/partenze/'.rawurlencode ('S0'.$_POST['staP']).'/'.rawurlencode ($dateS);
	$urlPartenze='http://www.viaggiatreno.it/viaggiatrenonew/resteasy/viaggiatreno/arrivi/'.rawurlencode ('S0'.$_POST['staP']).'/'.rawurlencode ($dateS);
	file_put_contents('url',$urlArrivi);

	$response = file_get_contents($urlArrivi);
	$response = json_decode($response);
	$c=count($response);
	$retArr=[];

	for($i=0;$i<$c;$i++){
		$retArr[]=array(
						$i+1,
						$response[$i]->numeroTreno
					);
	}
	
	$response = file_get_contents($urlPartenze);
	$response = json_decode($response);
	$c=count($response);
	$retPart=[];

	for($i=0;$i<$c;$i++){
		$retPart[]=array(
						$i+1,
						$response[$i]->numeroTreno
					);
	}
	
	echo json_encode(array('Arrivi'=>$retArr,'Partenze'=>$retPart));
	exit();
}

?>