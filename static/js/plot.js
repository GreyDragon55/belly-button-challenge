function buildMetadata(data, sample) {
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = metadataArray[0];
    var PANEL = d3.select("#sample-metadata");
    // Clear PANEL before populating with new data
    PANEL.html("");
    Object.entries(selectedSample).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key}: ${value}`);
    });
}

function buildCharts(data, sample) {
    var samples = data.samples;
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];
    var otu_ids = selectedSample.otu_ids;
    var otu_labels = selectedSample.otu_labels;
    var sample_values = selectedSample.sample_values;
    var wfreq = metadataArray[0].wfreq;
    
    // -------- BAR CHART -------------------------------------
    // Create y labels with "OTU" preceding otu_id ie. OTU 1167
    var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();
    var barData = [{
        x: sample_values.slice(0,10).reverse(),
        y: yticks,
        type: "bar",
        orientation: "h",
        text: otu_labels.slice(0,10),
    }];
    var barLayout = {
        title: "Top 10 OTUs per Sample"
    };
    Plotly.newPlot("bar", barData, barLayout);
    // -------- BAR CHART -------------------------------------
    
    // -------- GAUGE CHART (combination scatter and Pie chart)-
    // Trig to calc meter point
    var degrees = 180 - wfreq * 20,
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        var gaugeData = [{
            type: 'scatter',
            x: [0], 
            y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'scrubs per week',
            text: wfreq,
            hoverinfo: 'text+name'
        },
        { 
            values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            rotation: 90,
            text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
            textinfo: 'text',
            textposition:'inside',
            marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
            'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
            'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
            'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1',''],
hoverinfo: 'label',
hole: .5,
type: 'pie',
showlegend: false
}];
var gaugeLayout = {
shapes:[{
type: 'path',
path: path,
fillcolor: '850000',
line: {
color: '850000'
}
}],
title: 'Belly Button Washing Frequency<br>Scrubs per Week',
height: 500,
width: 500,
xaxis: {
zeroline:false, 
showticklabels:false,
showgrid: false, 
range: [-1, 1]
},
yaxis: {
zeroline:false, 
showticklabels:false,
showgrid: false, 
range: [-1, 1]
}
};
Plotly.newPlot("g
Plotly.newPlot("gauge", gaugeData, gaugeLayout);
// -------- GAUGE CHART -------------------------------------

// -------- BUBBLE CHART -------------------------------------
var bubbleData = [{
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    marker: {
        size: sample_values,
        color: otu_ids
    },
    text: otu_labels
}];
var bubbleLayout = {
    xaxis: {title: "OTU ID"},
    height: 600,
    width: 1000
};
Plotly.newPlot("bubble", bubbleData, bubbleLayout);
// -------- BUBBLE CHART -------------------------------------
}

function optionChanged(sample) {
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(data => {
    buildMetadata(data, sample);
    buildCharts(data, sample);
});
}

function init() {
var selector = d3.select("#selDataset");
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(data => {
    var sampleNames = data.names;
    sampleNames.forEach(sample => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });
    var initialSample = sampleNames[0];
    buildMetadata(data, initialSample);
    buildCharts(data, initialSample);
});
}

init();
