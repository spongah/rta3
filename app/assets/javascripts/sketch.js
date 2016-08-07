var mic;
var fft;
var maxLevel= 0;
var oneThirdFreqArray = [12.5,16,20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneThirdFreqArrayOptimized = [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneSixthFreqArray = [50,56,63,72,81,92,104,118,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];
var oneSixthFreqArrayOptimized = [50,63,81,104,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];

var freqArray = oneSixthFreqArrayOptimized;  	// SET NUMBER OF BARS HERE
var energyFactor = 0.2; 							// SET ENERGY MULTIPLIER HERE
var barMultiplier = 7;
var barFloor = 10;

var barWidth = parseInt(100 / freqArray.length) * 0.78;
var barHeight = 0;


function setup() {
	mic = new p5.AudioIn();
	mic.start();
	fft = new p5.FFT();
	fft.setInput(mic); //moved from draw
	for (x=0;x<freqArray.length;x++) {
		document.getElementById("rta").innerHTML += '<div class="rtabar" id="bar' + x + '"></div>';
		document.getElementById('bar' + x).style.width = barWidth.toString() + "%"
		//document.getElementById('bar' + x).innerHTML = freqArray[x];
	}
	for (x=0;x<freqArray.length;x++) {
		labelNum = freqArray[x];
		if (labelNum > 999) {
			labelNum = (labelNum / 1000).toPrecision(2).toString() + "k";
		}
		document.getElementById("rtalabel").innerHTML += '<div class="rtafreq" id="label' + x + '"></div>';
		document.getElementById('label' + x).style.width = barWidth.toString() + "%"
		document.getElementById('label' + x).innerHTML = labelNum;
	}
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
		//document.getElementById('bar' + x).style.marginTop = barHeight.toString() + "%";
		document.getElementById('bar' + x).style.height = barHeightPercent.toString() + "%";
	}
}