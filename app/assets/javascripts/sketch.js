
// PULLS PARAMETERS
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

var mic;
var fft;
var maxLevel= 0;
var oneThirdFreqArray = [12.5,16,20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneThirdFreqArrayOptimized = [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
var oneSixthFreqArray = [50,56,63,72,81,92,104,118,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];
var oneSixthFreqArrayOptimized = [50,63,81,104,133,150,170,192,216,245,277,313,353,400,452,510,576,651,735,831,940,1062,1200,1356,1532,1739,1955,2210,2498,2822,3189,3604,4072,4600,5200,5875,6640,7502,8478,9580,10825,12232,13822,15620,17650,20000];

var freqArray = [];
var barWidth = 0;

if (QueryString.bands == 26) {
	freqArray = oneThirdFreqArrayOptimized;
	barWidth = parseInt(100 / freqArray.length) * 0.9;
} else if (QueryString.bands == 45) {
	freqArray = oneSixthFreqArrayOptimized;
	barWidth = parseInt(100 / freqArray.length) * 0.78;
} else {
	freqArray = oneThirdFreqArrayOptimized;  		// DEFAULT
	barWidth = parseInt(100 / freqArray.length) * 0.9;
}

var energyFactor = 0.2; 											// SET ENERGY MULTIPLIER HERE
var barMultiplier = 7;
var barFloor = 10;

var barHeight = 0;


function setup() {
	mic = new p5.AudioIn();
	mic.start();
	fft = new p5.FFT();
	fft.setInput(mic);

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




