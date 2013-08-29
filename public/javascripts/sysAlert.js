var monitor = function(ip){
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $('#container').highcharts({
        chart: {
            type: 'spline',
            animation: Highcharts.svg,
            marginRight: 10
        },
        title: {
            text: 'System Monitor'
        },
        credits : {
            href:'http://blog.fens.me',
            position: {
                x:-30,
                y:-30
            },
            style:{
                color:'#191a37',
                fontWeight:'bold'
            },
            text:'http://blog.fens.me'
        },
        xAxis: {
            maxPadding : 0.05,
            minPadding : 0.05,
            type: 'datetime',
            tickWidth:5
        },
        yAxis: {
            title: {
                text: 'Percent(%)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            formatter: function() {
                    return '<b>'+ this.series.name +'</b>('+num+')<br/>'+
                    Highcharts.dateFormat('%H:%M:%S', this.x) +'<br/>'+
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: true
        },
        exporting: {
            enabled: false
        },
        series: [{
            name: 'CPU',
            data: [
                [(new Date()).getTime(),0]
            ]
        },{
            name: 'Memory',
            data: (function() {
                var data = [];
                data.push([(new Date()).getTime(),0]);
                return data;
            })()
        }]
    });


    var num = 0;
    var socket = io.connect(ip);
    socket.on('system', function (data) {
        var x = data.time;
        var y1 = data.cpu;
        var y2= data.mem;
        console.log("time:"+x+",CPU:"+y1+",Memory:"+y2);


        var chart = $('#container').highcharts();
        chart.series[0].addPoint([x, y1], true, (++num>120?true:false));     
        chart.series[1].addPoint([x, y2], true, (num>120?true:false));    
    });
}


var startup = function(){
    var ip = $('#host').val();
    monitor(ip);
    $('#node').remove();
}
