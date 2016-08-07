var mic;
var fft;
var maxLevel= 0;
var oneOctaveFreqArray = [50,100,200,400,800,1600,3200,6400,12800,20000];
var oneHalfFreqArray = [50,72,100,160,200,315,400,630,800,1250,1600,2500,3150,4800,6300,9600,12500,16000];
var oneThirdFreqArray = [12.5,16,20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneThirdFreqArrayOptimized = [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneSixthFreqArray = [50,56,63,72,81,92,104,118,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];
var oneSixthFreqArrayOptimized = [50,63,81,104,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];
var freqArray = [];
var barWidth = 0;
var barSpeed = "";
var energyFactor = 0.2; 											// SET ENERGY MULTIPLIER HERE
var barMultiplier = 7;
var barFloor = 10;
var barHeight = 0;

function setup() {
	mic = new p5.AudioIn();
	mic.start();
	fft = new p5.FFT();
	fft.setInput(mic);
	redrawRta(26);
	updateSpeed("medium");
}

function draw() {
	spectrum = fft.analyze(); 
	drawRTA(freqArray);
}

function drawRTA() {
	for (x=0;x<freqArray.length;x++) {
		barHeight = parseInt(fft.getEnergy(freqArray[x]) * energyFactor);
		barHeightPercent = ((barHeight * barMultiplier) + barFloor) * 0.25;
		if (barHeight > 100) { barHeight = 100 };
		barElement = document.getElementById('bar' + x);
		//document.getElementById('bar' + x).style.marginTop = barHeight.toString() + "%";
		if ((typeof(barElement) != 'undefined') && (barElement != null)) {
			barElement.style.height = barHeightPercent.toString() + "%";
		}
	}
}

function updateSpeed(newSpeed) {
	barSpeed = newSpeed;
	speedValue = "0.09s";
	if (newSpeed == "slowest") { speedValue = "0.25s" }
	if (newSpeed == "slow") { speedValue = "0.15s" }
	if (newSpeed == "medium") { speedValue = "0.09s" }
	if (newSpeed == "fast") { speedValue = "0.01s" }
	
	var bars = document.getElementsByClassName("rtabar");
	for (bar = 0 ; bar < bars.length ; bar += 1) {
		document.getElementById(bars[bar].id).style.transitionDuration = speedValue;
	};

	// CLEAR ACTIVE SPEED BUTTON
	var activeButtons = document.getElementsByClassName("optActive speed noselect");
	for (x = 0 ; x < activeButtons.length ; x += 1) {
		document.getElementById(activeButtons[x].id).className = "opt";
	};

	document.getElementById(newSpeed).className = "optActive speed noselect";
}

function redrawRta(bands) {
	setBands(bands);
	clearBars();
	createBars();
	var speeds = document.getElementsByClassName("optActive speed noselect");  //RETAIN SELECTED SPEED
	if ((typeof(speeds[0]) != 'undefined') && (speeds[0] != null)) {
		updateSpeed(speeds[0].id);
	}
}

function setBands(bands) {
	var activeButtons = document.getElementsByClassName("optActive bands noselect");
	for (x = 0 ; x < activeButtons.length ; x += 1) {				// CLEAR ACTIVE BANDS BUTTON
		document.getElementById(activeButtons[x].id).className = "opt bands noselect";
	};

	if (bands == 10) {	
		freqArray = oneOctaveFreqArray;
		barWidth = parseInt(100 / freqArray.length) * 0.76;
		document.getElementById("octave").className="optActive bands noselect";
	} else if (bands == 18) {								
		freqArray = oneHalfFreqArray;
		barWidth = parseInt(100 / freqArray.length) * 0.9;
		document.getElementById("half").className="optActive bands noselect";
	}else if (bands == 26) {								
		freqArray = oneThirdFreqArrayOptimized;
		barWidth = parseInt(100 / freqArray.length) * 0.9;
		document.getElementById("third").className="optActive bands noselect";
	} else if (bands == 45) {
		freqArray = oneSixthFreqArrayOptimized;
		barWidth = parseInt(100 / freqArray.length) * 0.78;
		document.getElementById("sixth").className="optActive bands noselect";
	} else {
		freqArray = oneThirdFreqArrayOptimized;  		// DEFAULT
		barWidth = parseInt(100 / freqArray.length) * 0.9;
		document.getElementById("third").className="optActive bands noselect";
	}
}

function clearBars() {
	rtaElement = document.getElementById("rta")
	if ((typeof(rtaElement) != 'undefined') && (rtaElement != null)) {
		document.getElementById("rta").innerHTML = '<div class="rtalabel" id="rtalabel"></div>';
	}
	
}

function createBars() {
	for (x=0;x<freqArray.length;x++) {  // CREATE RTA BARS
		document.getElementById("rta").innerHTML += '<div class="rtabar" id="bar' + x + '"></div>';
		document.getElementById('bar' + x).style.width = barWidth.toString() + "%"
	}

	for (x=0;x<freqArray.length;x++) {	// CREATE LABELS
		labelNum = freqArray[x];
		if (labelNum > 999) {
			labelNum = (labelNum / 1000).toPrecision(2).toString() + "k";
		}
		document.getElementById("rtalabel").innerHTML += '<div class="rtafreq" id="label' + x + '"></div>';
		document.getElementById('label' + x).style.width = barWidth.toString() + "%"
		document.getElementById('label' + x).innerHTML = labelNum;
	}
}


