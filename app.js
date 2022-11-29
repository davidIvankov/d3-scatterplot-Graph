let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
 
let req = new XMLHttpRequest()
let data
let values
let yScale
let xScale
let xAxesScale
let yAxesScale

let width = 800;
let height= 500;
let padding = 40;

let svg = d3.select("svg");

let drawCanves =()=>{
  svg.attr("height", height)
     .attr("width", width)
 // legend
  svg.selectAll("rect")
     .data(["rgba(2, 117, 216, 0.5)", "rgba(217, 83, 79, 0.5)"])
     .enter()
     .append("rect")
     .attr("height", 20)
     .attr("width", 20)
     .attr("y", (d, i)=> {
    return height/ 2 + i* 22
  })
     .attr("x", width - padding)
     .attr("fill", (d)=> d)
  
  const dopping = ["No dopping Allegations \n Riders with dopping allegatios"]
        console.log(dopping.map((d)=>d))
  
  svg
    .append("text")
    .attr("id", "legend")
    .text("No doping allegations")
    .attr("y", (height/ 2) + 15  )
    .attr("x", width - 180)
  
  svg
    .append("text")
    .attr("id", "legend")
    .text("Riders with dopping allegations")
    .attr("y", (height/ 2) + 36  )
    .attr("x", width - 240)
    
}


let generateScales =()=>{
  yScale = d3.scaleLinear()
             .domain([d3.max(data, d=> d.Seconds), d3.min(data, d=> d.Seconds)])
             .range([padding, height - padding]);
  
  xScale= d3.scaleLinear()
           .domain([d3.min(data, (d)=> d.Year) - 1, d3.max(data, (d)=> d.Year)])
             .range([padding, width - padding])
  let dateArr = data.map((d)=>{
    return new Date(d.Year.toString() +"-01-01" )  
  })
 
  xAxesScale = d3.scaleTime()
              .domain([d3.min(dateArr) - 31556952000, d3.max(dateArr)])
              .range([padding, width - padding])
  
let timeArr = data.map((d)=>{
    let min = Number(d.Time.slice(0, 2)) * 60000
    let sec = Number(d.Time.slice(3, 6)) * 1000
    return new Date(min + sec)
  })

  yAxesScale = d3.scaleTime()
                 .domain([d3.max(timeArr), d3.min(timeArr)])
                 .range([height - padding, padding])
  
    

  
};

let drawDots=()=>{
  
  let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                 .style("visibility", "hidden")
                 .style("height", "auto")
                 .style("width", "auto")
  
  
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("data-xvalue", (d)=> d.Year)
     .attr("data-yvalue", (d)=>{
    let min = Number(d.Time.slice(0, 2)) * 60000
    let sec = Number(d.Time.slice(3, 6)) * 1000
    return new Date(min + sec)
  })
     .attr("r", 8)
     .attr("cy", (d)=>(height) - yScale(d.Seconds))
     .attr("cx", (d)=> xScale(d.Year))
     .attr("fill", (d)=>{
    if ( d.Doping === "") {
      return 	"rgba(2, 117, 216, 0.5)"
    } else {
      return "rgba(217, 83, 79, 0.5)"
    }
  })
    .on("mouseover", (d)=>{
    tooltip.transition()
          .style("visibility", "visible")
          
    tooltip.text(d.Name + ": " + d.Nationality + "\n Year: " + d.Year.toString() + ", Time:" + d.Time + " \n" + d.Doping )
          .attr("data-year", d.Year)
  })
   .on("mouseleave", (d)=>{
    tooltip.transition()
           .style("visibility", "hidden")
  })
}

let generateAxes=()=>{
   let xAxis = d3.axisBottom(xAxesScale)  
 let yAxis = d3.axisLeft(yAxesScale)
               .tickFormat((d) =>{ 
                 if(d.getSeconds() < 10){
              return     [d.getMinutes()+ ":" + d.getSeconds() + "0"]
                 } else
              return   [d.getMinutes()+ ":" + d.getSeconds()]
               })
 
  svg.append("g")
     .call(xAxis)
     .attr("transform", "translate(0, " + (height - padding) + ")")
     .attr("id", "x-axis")
  
  svg.append("g")
     .call(yAxis)
     .attr("id", "y-axis")
     .attr("transform", "translate(" + padding + " ,0)")
  
}

req.open("GET", url, true)
req.onload=()=>{
  data = JSON.parse(req.responseText)

  console.log(data.map((d)=>{
    if (d.Year === 1994) {
      return d
    }
  }))
   drawCanves()
  generateScales()
  drawDots()
  generateAxes()
}
req.send()