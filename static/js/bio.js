const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
let bio = ''
// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
 bio = data;
});

console.log(url)

function buildPlots() {
   // Read in json file
   d3.json(url).then(bio => {
       console.log(bio)
       
       var otuIds = bio.samples[0].otu_ids;
       console.log(otuIds)
       
       var sampleValues = bio.samples[0].sample_values.slice(0,10).reverse();
       console.log(sampleValues)
       
       var otuLabels = bio.samples[0].otu_labels.slice(0,10).reverse();
       console.log(`OTU labels: ${otuLabels}`)
       
       var topOtuIds = bio.samples[0].otu_ids.slice(0,10).reverse();
     
       var otuIdLabels = topOtuIds.map(d => "OTU " + d);
       console.log(`OTU ids: ${otuIdLabels}`)
     
       // Bar chart
       var trace1 = {
           x: sampleValues,
           y: otuIdLabels,
           text: otuLabels,
           marker: {
               color: "green"
           },
           type: "bar",
           orientation: "h"
       };
       
       var data = [trace1];
       var layout = {
           margin: {
               l: 100,
               r: 100,
               t: 100,
               b: 100
           }
       };

       // Create bar plot
       Plotly.react("bar", data, layout);

       // Bubble plot
       var trace2 = {
           x: bio.samples[0].otu_ids,
           y: bio.samples[0].sample_values,
           mode: "markers",
           marker:{
               size: bio.samples[0].sample_values,
               color: bio.samples[0].otu_ids
           },
           text: bio.samples[0].otu_labels
       };

       
       var data2 = [trace2];
       var layout2 = {
           xaxis: {title: "OTU ID"},
           height: 600,
           width: 1200
       };

       // Create bubble plot
       Plotly.react("bubble", data2, layout2);

       // Dropdown
       dropdown = document.getElementById('selDataset');
       defaultOption = document.createElement('option')
       options = bio.names
     
       for (i=0; i < options.length; i++){
           option = document.createElement('option');
           option.text = options[i];
           option.value = options[i];
           dropdown.add(option);
       };
       
       var metadata = bio.metadata;
       console.log(metadata)
       
       var id = 940;
       
       var result = metadata.filter(meta => meta.id === id)[0];
       console.log(result)
       
       var demoInfo = d3.select("#sample-metadata");
       
       demoInfo.html("");
       
       Object.entries(result).forEach((key) => {
           demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[0] + "\n");
           });
       });
   };  

// Function for change
d3.selectAll("#selDataset").on("change", getData);

function getData() {

   dropDown = d3.select("#selDataset");
   idInfo = dropDown.property("value");
   console.log(idInfo)
   d3.json(url).then(bio => {
       idNo = bio.names
       for (i = 0; i < idNo.length; i++) {
           if (idInfo == idNo[i]) {
           
               // Bar Plot
               console.log("success")
               var sampleValues = bio.samples[i].sample_values.slice(0,10).reverse();
               var otuLabels = bio.samples[i].otu_labels.slice(0,10).reverse();
               var topOtuIds = bio.samples[i].otu_ids.slice(0,10).reverse();
               var otuIdLabels = topOtuIds.map(d => "OTU " + d);

               var trace1 = {
                   x: sampleValues,
                   y: otuIdLabels,
                   text: otuLabels,
                   marker: {
                       color: "green"
                   },
                   type: "bar",
                   orientation: "h"
               };

               var data1 = [trace1];
               var layout = {
                   margin: {
                       l: 100,
                       r: 100,
                       t: 100,
                       b: 100
                   }
               };

               // Bubble Chart
               var trace2 = {
                   x: bio.samples[i].otu_ids,
                   y: bio.samples[i].sample_values,
                   mode: "markers",
                   marker:{
                       size: bio.samples[i].sample_values,
                       color: bio.samples[i].otu_ids
                   },
                   text: bio.samples[i].otu_labels
               };

               var data2 = [trace2];
               var layout1 = {
                   xaxis: {title: "OTU ID"},
                   height: 600,
                   width: 1200
               };

               //Demographic Info
               var metadata = bio.metadata;

               console.log(metadata)
               var result = metadata.filter(meta => meta.id === +idInfo)[0];
       
               var demoInfo = d3.select("#sample-metadata");

               demoInfo.html("");
               console.log(result)
               Object.entries(result).forEach((key) => {
                   demoInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
               });
       updatePlotly(data1, data2, result)
           }
       }
   });
}

function updatePlotly(newdata1, newdata2, result) {
   var layout1 = {
       xaxis: {
           title: {
             text: 'OTU IDs'}}
       };
   
   var layout2 = {
       height: 600,
       width: 1200,
       xaxis: {
           title: {
             text: 'OTU IDs'}}
       };
   Plotly.react('bar',newdata1, layout1);
   Plotly.react('bubble', newdata2, layout2);

   box = d3.selectAll('#sample-metadata');
   box.html('');
   
   Object.entries(result).forEach(([key,value]) => {
       console.log(`${key}: ${value}`);
       box.append('ul').text(`${key}: ${value}`);
   });
}

getData();
buildPlots();