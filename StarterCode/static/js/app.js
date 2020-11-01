dropdown = d3.select("#selDataset");

d3.json("samples.json").then(processData);

function processData(data) {
    console.log(data);
    names = data.names;
    samples = data.samples;
    names.forEach( function (name) {
        dropdown.append("option").text(name).property(name);
    })

    function grab(id) {
        filtered = samples.filter(d => d.id == id);
        console.log(filtered);
        otus = filtered.map(row => row.otu_ids);
        sample_values = filtered.map(row => row.sample_values);
        sorted = sample_values.sort((first,second) => second-first);
        
        var trace = {
           y: sorted,
           x: otus,
           orientation: "h",
           type: "bar"
        }

        Plotly.newPlot("bar",[trace])
        
    };

    dropdown.on("change", handle)

    function handle() {
        console.log("Handled!")
        input = dropdown.property("value")
        grab(input)
        
    }


}