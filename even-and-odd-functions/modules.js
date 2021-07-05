var Grapher = function(cvs){
	this.cvs = cvs
	this.ctx = cvs.getContext("2d")
	this.cvs.width = 400
	this.cvs.height = 400
	this.graphs = {}
	this.listeners = {}
}
Grapher.prototype.drawAxis = function(){
	this.ctx.strokeStyle = "black"
	this.ctx.lineWidth = "1"
	this.ctx.beginPath()
	this.ctx.moveTo(0, 200)
	this.ctx.lineTo(400, 200)
	this.ctx.moveTo(200, 0)
	this.ctx.lineTo(200, 400)
	this.ctx.stroke()
}
Grapher.prototype.background = function(){
	this.ctx.fillStyle = "cornsilk"
	this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height)
	this.drawAxis()
}
Grapher.prototype.addGraph = function(name, color, graphData){
	this.graphs[name] = {
		data: graphData||new Array(400).fill(200),
		color: color
	}
}
Grapher.prototype.drawGraph = function(graph){
	this.ctx.strokeStyle = graph.color
	this.ctx.beginPath()
	this.ctx.lineWidth = "2"
	graph.data.forEach((e,i)=>{
		this.ctx.lineTo(i, e)
	}, this)
	this.ctx.stroke()
}
Grapher.penFunc = function(grapher, graph_name){
	 grapher.listeners[graph_name] = function(e){
		grapher.graphs[graph_name].data[e.offsetX] = e.offsetY
		grapher.background()
		grapher.drawGraph(grapher.graphs[graph_name])
		grapher.lastDot = [e.offsetX, e.offsetY]
		grapher.cvs.addEventListener("mousemove", Grapher.mousemoveFunction(grapher, graph_name))
	}
	return grapher.listeners[graph_name]
}
Grapher.mousemoveFunction = function(grapher, graph_name){
	grapher.listeners["mousemovefunction"] = function(e){
		let sx = grapher.lastDot[0]
		let fx = e.offsetX
		
		let dx = Math.sign(fx-sx)
		let h = e.offsetY-grapher.lastDot[1]
		let i = grapher.lastDot[0]
		while(i!=fx){
			grapher.graphs[graph_name].data[i] = grapher.lastDot[1]+h*(i-sx)/(fx-sx)
			i += dx
		}
		grapher.lastDot = [e.offsetX, e.offsetY]
		grapher.background()
		grapher.drawGraph(grapher.graphs[graph_name])
	}
	return grapher.listeners["mousemovefunction"]
}
Grapher.prototype.addPen = function(graph_name){
	let grapher = this
	grapher.listeners["cancelmousemove"] = function(e){
		grapher.cvs.removeEventListener("mousemove", grapher.listeners.mousemovefunction)
	}
	this.cvs.addEventListener("mousedown", Grapher.penFunc(this, graph_name))
	this.cvs.addEventListener("mouseup", grapher.listeners["cancelmousemove"])
	this.cvs.addEventListener("mouseleave", grapher.listeners["cancelmousemove"])
}
Grapher.prototype.removePen = function(graph_name){
	this.cvs.removeEventListener("mousedown", this.listeners[graph_name])
	this.cvs.removeEventListener("mouseup", this.listeners["cancelmousemove"])
	this.cvs.removeEventListener("mouseleave", this.listeners["cancelmousemove"])
}

export default Grapher
