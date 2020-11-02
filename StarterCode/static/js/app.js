dropdown = d3.select("#selDataset");
meta = d3.select("#sample-metadata");

d3.json("samples.json").then(processData);

function processData(data) {

    console.log(data);
    metadata = data.metadata;
    names = data.names;
    samples = data.samples;
    names.forEach( function (name) {
        dropdown.append("option").text(name).property(name);
    })

    function plot(id) {
        filteredMeta = metadata.filter(d => d.id == id)[0];
        filteredSamples = samples.filter(d => d.id == id)[0];
        
        meta.html(`id: ${id} <br> 
            ethnicity: ${filteredMeta.ethnicity} <br>
            gender: ${filteredMeta.gender} <br>
            age: ${filteredMeta.age} <br>
            location: ${filteredMeta.location} <br>
            bbtype: ${filteredMeta.bbtype} <br>
            wfreq: ${filteredMeta.wfreq} <br>`)

        otus = filteredSamples.otu_ids;
        //QUESTION: Can't get anonymous function to return OTU id to otus or new list
        labels = otus.forEach(function(otu) {
            console.log("OTU " + String(otu))
        });
        console.log(labels);
        hover = filteredSamples.otu_labels;
        console.log(hover);
        sample_values = filteredSamples.sample_values;
        sample_values = sample_values.sort((first,second) => second-first);
        
        sample_values = sample_values.slice(0,10);
        otus = otus.slice(0,10);
        hover = hover.slice(0,10);
        console.log(sample_values);

        var trace = {
           x: sample_values,
           y: otus,
           text: hover,
           orientation: "h",
           type: "bar",
        };

        var bubble = {
            x: otus,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otus
            },
            text: hover
        };

        var layout = {
            xaxis: {
                autorange: true
            }
        };

        // QUESTION: Plotly.restyle("bar", [trace], layout) doesn't work!
        Plotly.newPlot("bar",[trace],layout);
        Plotly.newPlot("bubble",[bubble],layout);

    };

    function init() {
        plot(940);
    };

    init(940);

    dropdown.on("change", handle);

    function handle() {
        input = dropdown.property("value");
        plot(input);
        
    }
}
