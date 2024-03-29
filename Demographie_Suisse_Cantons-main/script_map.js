// Troisième visualisation - Map de la Suisse
// Taille du graphique
var width_map = 1500
var height_map = 500
  
  // Ajout de l'objet svg au corps de la page
  const svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width_map)
      .attr("height", height_map)

// Map et projection
const projection = d3.geoMercator()
    .center([10, 46])                // Localisation GPS de la map
    .scale(5000)                       // Zoom
    .translate([ width_map/2, height_map/2 ])

// Données pour les chefs-lieux les cantons
const markers = [
  {long: 8.539183, lat: 47.368650, name: "Zürich", habs: 1539.3, region: "All"},  
  {long: 6.143158, lat: 46.304391, name: "Genève", habs: 504.1, region: "Fr"},
  {long: 6.632273, lat: 46.519653, name: "Lausanne", habs: 805.1, region: "Fr"},
  {long: 6.931933, lat: 46.992979, name: "Neuchâtel", habs:176.5, region: "Fr"}, 
  {long: 7.153656, lat: 46.806403, name: "Fribourg", habs: 321.8, region: "Fr"},//
  {long: 7.444609, lat: 46.947922, name: "Berne", habs: 1039.5, region: "All"}, 
  {long: 7.362049, lat: 46.229352, name: "Sion", habs: 345.5, region: "Fr"}, 
  {long: 7.3333, lat: 47.3667, name: "Delémont", habs:82.3, region: "Fr"},
  {long: 8.24531, lat: 46.89611, name: "Sarnen", habs:37.9, region: "All"}, 
  {long: 8.308929, lat: 47.050038, name: "Lucerne", habs: 413.1, region: "All"},
  {long: 7.532291, lat: 47.208835, name: "Solothurn", habs: 275.2, region: "All"}, 
  {long: 7.588576, lat: 47.559599, name: "Basel", habs: 195.8, region: "All"}, 
  {long: 7.739573, lat: 47.481606, name: "Liestal", habs: 289.5, region: "All"}, 
  {long: 8.515495, lat: 47.166167, name: "Zug", habs: 127.6, region: "All"}, 
  {long: 8.515495, lat: 47.166167, name: "Schwyz", habs: 160.5, region: "All"}, 
  {long: 8.640549, lat: 46.877893, name: "Altdorf", habs: 36.7, region: "All"},
  {long: 9.631986, lat: 46.650783, name: "Chur", habs: 199.0, region: "All"},
  {long: 9.067208, lat: 47.040427, name: "Glarus", habs: 40.6, region: "All"},
  {long: 9.067208, lat: 47.040427, name: "Stans", habs:43.1, region: "All"},
  {long: 9.376717, lat: 47.424482, name: "St.Gallen", habs:510.7, region: "All"},
  {long: 9.279847, lat: 47.385701, name: "Herisau", habs:55.4, region: "All"},
  {long: 8.898754, lat: 47.553600, name: "Frauenfeld", habs:279.5, region: "All"},
  {long: 8.638049, lat: 47.695890, name: "Schaffhausen", habs:82.3, region: "All"},
  {long: 8.79, lat: 46.19, name: "Bellizona", habs: 351.5, region: "It"}
];

// Chargement de données externes pour la carte
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then( function(data){

    // Filtre uniquement la carte de la Suisse
    data.features = data.features.filter( d => d.properties.name=="Switzerland")

    // Dessine la Map 
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .join("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "black")
        .style("opacity", .5)

    // Créer le tooltip pour voir le contenu des cercles
    const Tooltip = d3.select("#my_dataviz")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 1)
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Même couleurs que pour le svg précédent 
    var color = d3.scaleOrdinal()
      .domain(markers)
      .range(d3.schemeDark2);

    // Fonctions pour survoler et voir les infos dans les cercles
    const mouseover = function(event, d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(event, d) {
      Tooltip
        .html(d.name + "<br>" + "Longitude: " + d.long + "<br>" + "Latitude: " + d.lat + "<br>" + "Habitants en milliers du canton: " + d.habs)
        .style("left", (event.x)/2 + "px")
        .style("top", (event.y)/2 - 30 + "px")
    }
    var mouseleave = function(event, d) {
      Tooltip.style("opacity", 0)
    }

    // Ajout des cercles
    svg
      .selectAll("myCircles")
      .data(markers)
      .join("circle")
        .attr("cx", d => projection([d.long, d.lat])[0])
        .attr("cy", d => projection([d.long, d.lat])[1])
        .attr("r", 10)
        .attr("class", "circle")
        .style("fill", function(d){ return color(d.region)})
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill-opacity", 0.7)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  })

  // Deuxième zone svg pour la description
var Svg = d3.select("#my_dataviz2")

var keys = ["Canton Germanophone", "Canton Francophone", "Canton Italophone"]

// Même couleurs que pour le svg précédent 
var color = d3.scaleOrdinal()
  .domain(keys)
  .range(d3.schemeDark2);

// Un point pour chaque key
Svg.selectAll("mydots")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 20)
    .attr("cy", function(d,i){ return 17 + i*25}) // Placement des points
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Ajout de labels à côté des points
Svg.selectAll("mylabels")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 40)
    .attr("y", function(d,i){ return 20 + i*25})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")