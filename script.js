let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let req = new XMLHttpRequest()

let data
let values = []

let yScale
let xScale
let xAxisScale
let yAxisScale

let width = 1000
let height = 600
let padding = 50

let svg = d3.select("svg")

// making functions

// draws the svg canvas with width and height attributes
let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

//generates the scales and assigns them to the variables
let generateScales = () => {

    yScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item)   => {
                        return item [1]
                    })])
                    // the range is the range of corrdinates it takes up on canvas
                    .range([0, height - 2*padding])
                    
    xScale = d3.scaleLinear()
                    // domain is the indexes of the array of the dataset
                    .domain([0, values.length - 1])
                    // we want our graph's x axis to start and end inside the canvas (the box - padding)
                    .range([padding, width - padding])
    
    // this creates a new array and for each element in the set, it converts each one with index 0 into a date (from a string)
    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    console.log(datesArray)

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray), d3.max(datesArray)])
                    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(values, (item) => {
                        return item[1]
                    })])
                    .range([height - padding, padding])

}

// will draw the actual bars and tooltips
let drawBars = () => {

    let tooltip = d3.select("body")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("visibility", "hidden")
                    .style("width", "auto")
                    .style("height", "auto")

    svg.selectAll("rect")
        // calling data method to bind to values array - associates all rectangles to values array
        .data(values)
        // call enter method to specify what to do if there are items in teh aray that do not have a rectangle
        .enter()
        // creates rectangle for all array items
        .append("rect")
        .attr("class", "bar")
        .attr("width", (width - 2*padding)/ values.length)
        .attr("data-date", (item) => {
            return item[0]
        })
        .attr("data-gdp", (item) => {
            return item[1]
        })
        .attr("height", (item) => {
            return yScale(item[1])
        })
        // this separates out the bars to their corresponding 
        .attr("x", (item, index) => {
            return xScale(index)
        })
        .attr("y", (item) => {
            return (height - padding - yScale(item[1]) )
        })
        // this method allows teh tooltip to become visible wit text when hovered over a bar
        .on("mouseover", (item) => {
            tooltip.transition()
                .style("visibility", "visible")

            tooltip.text(item[0])

            // # for id
            document.querySelector("#tooltip").setAttribute("data-date", item[0])
                
        })
        .on("mouseout", (item) => {
            tooltip.transition()
                .style("visibility", "hidden")
        })
        
}

// will draw the X and Y axis on the canvas
let generateAxes = () => {

    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, "+ (height - padding) + ")")

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate("+ (padding) + ",0)")
}

// open takes in 3 arguments
// first argument is GET since we are fetching something
// second argument is the resource i.e. the dataset, which we have assigned to the url variable
// last argument is true, which runs this request asynchronously
req.open("GET", url, true)

//onload runs this function once the request has been obtained
req.onload = () => {
    // this converts the JSON string into a javascript object, then assigning it to data
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(req.responseText)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}

req.send()

