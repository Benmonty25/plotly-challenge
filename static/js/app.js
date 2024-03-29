let file = "samples.json"

function buildMetadata(samples) {
  d3.json(file).then(function(data) {
    var metadata= data.metadata;
    var results= metadata.filter(sampleobject => sampleobject.id == samples);
    var finalresult= results[0]
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(finalresult).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });

    // BONUS: Build the Gauge Chart
  
  });
}


function buildCharts(samples) {

// Use `d3.json` to fetch the sample data for the plots
d3.json(file).then(function(data) {
  var sample= data.samples;
  var results= sample.filter(sampleobject => sampleobject.id == samples);
  var finalresult= results[0]

  var ids = finalresult.otu_ids;
  var labels = finalresult.otu_labels;
  var values = finalresult.sample_values;


  // Build a Bubble Chart using the sample data
  var Layout = {
    margin: { t: 0 },
    xaxis: { title: "Id's" },
    hovermode: "closest",
    };

    var Data = [
    {
      x: ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: ids,
        size: values,
        }
    }
  ];

  Plotly.plot("bubble", Data, Layout);

  //  Build a bar Chart
  
  var data =[
    {
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x:values.slice(0,10).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  var layout = {
    title: "Top 10 Bacteria Cultures Found",
    margin: { t: 30, l: 150 }
  };

  Plotly.newPlot("bar", data, layout);
});
}
 

function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json(file).then(function(data) {
  var names = data.names;
  names.forEach(function(sample) {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = names[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
}

// Initialize the dashboard
init();