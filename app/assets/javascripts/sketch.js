var mic;
var fft;
var maxLevel= 0;
var oneThirdFreqArray = [12.5,16,20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneThirdFreqArrayOptimized = [40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];

var freqArray = oneThirdFreqArrayOptimized;  	// SET NUMBER OF BARS HERE
var energyFactor = 0.2; 							// SET ENERGY MULTIPLIER HERE
var barMultiplier = 7;
var barFloor = 10;

var barWidth = parseInt(100 / freqArray.length) * 1;


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