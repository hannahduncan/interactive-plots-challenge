var dropdown = d3.select("#selDataset");
var meta = d3.select("#sample-metadata");

d3.json("samples.json").then(processData);

function processData(data) {

    // console.log(data);
    var metadata = data.metadata;
    var names = data.names;
    var samples = data.samples;
    names.forEach( function (name) {
        dropdown.append("option").text(name).property(name);
    })

    function plot(id) {
        var filteredMeta = metadata.filter(d => d.id == id)[0];
        var filteredSamples = samples.filter(d => d.id == id)[0];
        
        meta.html(`id: ${id} <br> 
            ethnicity: ${filteredMeta.ethnicity} <br>
            gender: ${filteredMeta.gender} <br>
            age: ${filteredMeta.age} <br>
            location: ${filteredMeta.location} <br>
            bbtype: ${filteredMeta.bbtype} <br>
            wfreq: ${filteredMeta.wfreq} <br>`)

        var otus = filteredSamples.otu_ids;

        var labels = otus.toString()
        labels = labels.split(",");
        stuff = []
        labels.forEach(function(otu) {
            stuff.push("OTU " + otu)
        });
        // console.log(stuff);

        var hover = filteredSamples.otu_labels;
        // console.log(hover);

        var sample_values = filteredSamples.sample_values;
        // sample_values = sample_values.sort((first,second) => second-first);
        // console.log(sample_values);

        var sliced_values = sample_values.slice(0,10);
        var sliced_stuff = stuff.slice(0,10);
        var sliced_hover = hover.slice(0,10);
        // console.log(sliced_values);

        var trace = {
           x: sliced_values,
           y: sliced_stuff,
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

    function init() {
        plot(940);
    };

    init();

    dropdown.on("change", handle);

    function handle() {
        var input = dropdown.property("value");
        plot(input);
        
    }
}
