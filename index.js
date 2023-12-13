const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const req = new XMLHttpRequest();
req.open("GET", url,true);
req.send();
req.onload = () => {
     dataset = JSON.parse(req.responseText);
    creatingScales();
    createPoint();
    genAxes();
}
//Defining Global Variables

    let dataset;
    let yScale;
    let xScale;
    let xAxisScale;
    let yAxisScale
    let width = 800;
    let height = 600;
    let padding = 40

 //Defining svg element and functions
    const svg = d3.select('svg').attr('width', width).attr('height', height)

    const creatingScales = () =>{
        xScale = d3.scaleLinear().domain([d3.min(dataset, (d) => d['Year'] - 1), d3.max(dataset, (d) => d['Year'] + 1)])
        .range([padding, width - padding]);
        yScale = d3.scaleTime().domain([d3.max(dataset, (d) => new Date(d['Seconds'] * 1000)), d3.min(dataset, (d) => new Date(d['Seconds'] * 1000))])
        .range([height - padding, padding])
    }
    const genAxes = () =>{
            let xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
            svg.append("g").call(xAxis).attr('id', "x-axis")
            .attr("transform", "translate(0, " + (height - padding) + ")")
            let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'))
            svg.append('g').call(yAxis).attr('id', 'y-axis').attr("transform", "translate(" + padding + ", 0)")
            
    }
    const createPoint = () =>{

        let hoverTool = d3.select('body').append('div').attr('class', 'tooltip').attr('id','tooltip')
                        .style('opacity', 0);

        svg.selectAll('circle').data(dataset).enter().append('circle')
            .attr('class', 'dot')
            .attr('data-xvalue', (d) => d['Year'])
            .attr('data-yvalue', (d) => {
                return new Date(d['Seconds'] * 1000)
            })
            .attr('cx', (d) => xScale(d['Year']))
            .attr('cy', (d) => yScale(new Date(d['Seconds'] * 1000)))
            .attr('r', 6)
            .attr('fill', (d) => {
                if(d['Doping'] == ""){
                    return 'lightgreen'
                }
                else{
                    return 'orange'
                }
            })
            .on('mouseover', (d, event) =>{
                hoverTool.style('opacity', 0.9)
                .attr('data-year', d['Year'])
                .html(d['Name'] + ': ' + d['Nationality'] +
                '<br />' + 'Year: ' + d['Year'] + ', Time: ' + d3.timeFormat(d['Time']) +
                (d['Doping'] ? '<br />' + d['Doping']: ''))
                        .style('left', event.pageX + 'px')
                        .style('top', event.pageY  - 28 + 'px')
            })
            .on('mouseout', (d) =>{
                hoverTool.style('opacity', 0);
            })
            
    }
   