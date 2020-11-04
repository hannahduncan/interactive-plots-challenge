// Select dropdown and metadata ids from index.html
var dropdown = d3.select("#selDataset");
var meta = d3.select("#sample-metadata");

// Load data from samples json file
d3.json("Code/samples.json").then(processData);

function processData(data) {
    // Store desired values from file
    var metadata = data.metadata;
    var names = data.names;
    var samples = data.samples;

    // Create dropdown with Test Subject IDs
    names.forEach( function (name) {
        dropdown.append("option").text(name).property(name);
    })
    
    function plot(id) {
        // Filter metadata and samples arrays to those matching desired id
        var filteredMeta = metadata.filter(d => d.id == id)[0];
        var filteredSamples = samples.filter(d => d.id == id)[0];
        
        // Return html for each Test Subject's demographic information
        meta.html(`id: ${id} <br> 
            ethnicity: ${filteredMeta.ethnicity} <br>
            gender: ${filteredMeta.gender} <br>
            age: ${filteredMeta.age} <br>
            location: ${filteredMeta.location} <br>
            bbtype: ${filteredMeta.bbtype} <br>
            wfreq: ${filteredMeta.wfreq} <br>`)

        // Grab otu ids
        var otus = filteredSamples.otu_ids;
        
        // Create labels to use on y axis in horizontal bar chart
        var labels = otus.map( o => "OTU " + o)

        // Grab otu labels for hover text
        var hover = filteredSamples.otu_labels;

         // Grab samples for y data
        var sample_values = filteredSamples.sample_values;

        // Slice data for "top 10" in bar chart
        var sliced_values = sample_values.slice(0,10);
        var sliced_labels = labels.slice(0,10);
        var sliced_hover = hover.slice(0,10);

        // Create traces for bar and bubble chart
        var trace = {
           x: sliced_values,
           y: sliced_labels,
           text: sliced_hover,
           orientation: "h",
           type: "bar",
        };

        var bubble = {
            x: otus,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otus,
                colorscale: "YlGnBu"
            },
            text: hover
        };

        var bar_layout = {
            xaxis: {
                autorange: true
            },
            yaxis: {
                autorange: true
            }
        };

        var bubble_layout = {
            xaxis: {
                autorange: true
            },
            yaxis: {
                autorange: true
            }
        };

        Plotly.newPlot("bar",[trace],bar_layout);
        Plotly.newPlot("bubble",[bubble],bubble_layout);

    };

    // Initialize plot with Test Subject ID of 940
    function init() {
        plot(940);
    };

    init();

    // Create event listener
    dropdown.on("change", handle);

    // Create event handler for dropdown selection 
    function handle() {
        var input = dropdown.property("value");
        plot(input);
        
    }
}
