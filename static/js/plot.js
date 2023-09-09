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
