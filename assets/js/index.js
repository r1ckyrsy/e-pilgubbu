/*
Inspired by https://dribbble.com/shots/2004657-Alarm-Clock-concept
 */
var eventHub = new Vue()

Vue.component('app-clock', {
	data: function () {
		return {
			w 			: 0, // defined by user
	    hourArc	: 0,
	    minArc	: 0,
	  	time 		: 0,
	    tr	 		: 0, // transform
	    rch	 		: 0, // radius of circle hour component
	    rcm	 		: 0, // radius of circle minute component
	    rdh	 		: 0, // radius of dot hour component
	    rdm	 		: 0, // radius of dot minute component
	    arch 		: 0,
	    arcm 		: 0,
	    dhx			: 0, // x of dot hour component
	    dhy			: 0, // y of dot hour component
	    dmx			: 0, // x of dot minute component
	    dmy			: 0, // y of dot minute component
	    fsz 		: 0, // font size
	    swh			: 0, // stroke width of hour component
	    swm			: 0  // stroke width of minute component
		}
	},
	props: ['theme'],
	template:
		'<svg :style="{width: w+\'px\', height: w+\'px\'}" >\
		<defs>\
			<filter id="glow">\
					<feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>\
					<feMerge>\
						<feMergeNode in="coloredBlur"/>\
						<feMergeNode in="SourceGraphic"/>\
					</feMerge>\
			</filter>\
			<filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">\
				<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="shadow"/>\
				<feOffset dx="1" dy="1"/>\
				<feMerge>\
					<feMergeNode/>\
					<feMergeNode in="SourceGraphic"/>\
				</feMerge>\
			</filter>\
		</defs>\
		<!-- Clock objects -->\
		<circle class="clockCircle hour" :cx="tr" :cy="tr" :r="rch" :stroke-width="swh" />\
		<path id="arcHour" class="clockArc hour" :stroke-width="swh" stroke-linecap="round" filter="url(#glow)" :d="arch" />\
		<circle class="clockDot hour" :r="rdh" :cx="dhx" :cy="dhy" />\
		<circle class="clockCircle minute" :cx="tr" :cy="tr" :r="rcm" :stroke-width="swm" />\
		<path id="arcMinute" class="clockArc minute" :stroke-width="swm" stroke-linecap="round" filter="url(#glow)" :d="arcm" />\
		<circle class="clockDot minute" :r="rdm" :cx="dmx" :cy="dmy" />\
		<!-- Caption objects -->\
		<text class="timeText" :class="theme == \'light\' ? \'light\' : \'dark\'" :style="{fontSize: fsz+\'px\'}" :x="tr" :y="tr" stroke-width="0" text-anchor="middle" alignment-baseline="middle" filter="url(#shadow)">{{ time }}</text>\
	</svg>',
	watch: {
  	w: function (val) {
  		this.tr	= val / 2
  		this.rch= val * 0.4167
  		this.rcm= val * 0.4722
  		this.rdh= val / 37.5
  		this.rdm= val / 60
  		this.fsz= val / 3.75
  		this.swh= val / 50
  		this.swm= val / 75
  		this.refresh()
  	},
  	hourArc: function (val) {
  		this.drawHour(val)
  	},
  	minArc: function (val) {
  		this.drawMin(val)
  	}
  },
  created: function () {
  	eventHub.$on('set-width', this.setWidth)

  	app = this
  	app.setCaptions()
  	setInterval(function () {
		  return app.setCaptions()
    }, 10 * 1000)
  },
  beforeDestroy: function () {
  	eventHub.$off('set-width', this.setWidth)
  },
  methods: {
  	drawHour: function (hourArc) {
			this.arch 	= this.describeArc(this.tr, this.tr, this.rch, 0, hourArc)
  		var pos			= this.polarToCartesian(this.tr, this.tr, this.rch, hourArc)
  		this.dhx 		= pos.x
		  this.dhy 		= pos.y
  	},
  	drawMin: function (minArc) {
  		this.arcm 	= this.describeArc(this.tr, this.tr, this.rcm, 0, minArc)
		  var pos			= this.polarToCartesian(this.tr, this.tr, this.rcm, minArc)
		  this.dmx 		= pos.x
		  this.dmy 		= pos.y
  	},
  	polarToCartesian: function (centerX, centerY, radius, angleInDegrees) {
		  var angleInRadians
		  angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
		  return {
		    x: centerX + radius * Math.cos(angleInRadians),
		    y: centerY + radius * Math.sin(angleInRadians)
		  }
    },
    describeArc: function (x, y, radius, startAngle, endAngle) {
		  var arcSweep, end, start
		  start 		= this.polarToCartesian(x, y, radius, endAngle)
		  end 			= this.polarToCartesian(x, y, radius, startAngle)
		  arcSweep 	= endAngle - startAngle <= 180 ? '0' : '1'
		  return ['M', start.x, start.y, 'A', radius, radius, 0, arcSweep, 0, end.x, end.y].join(' ')
    },
    refresh: function () {
    	this.drawHour(this.hourArc)
    	this.drawMin(this.minArc)
    },
    setCaptions: function (hour, minute) {
		  var now
		  now 				= new Date()
		  hour 				= hour !== undefined ? hour : now.getHours() % 12
		  minute 			= minute !== undefined ? minute : now.getMinutes()
		  this.hourArc= (hour * 60 + minute) / (12 * 60) * 360
		  this.minArc	= minute / 60 * 360
		  this.time 	= moment().format('H:mm')
    },
    setWidth: function (val) {
    	this.w = val
    }
  }
})

var clock = new Vue({
  el: '#clock',
  data: {
  	width 	: 0, // defined by user
  	time 		: 0,
    tr	 		: 0,
    rh	 		: 0,
    rm	 		: 0,
    arch 		: 0,
    arcm 		: 0,
    dothx		: 0,
    dothy		: 0,
    dotmx		: 0,
    dotmy		: 0,
  	hourArc : 0,
  	minArc 	: 0
	},
	methods: {
		setWidth: function (val) {
			eventHub.$emit('set-width', val)
		}
	}

})

clock.setWidth(300)
