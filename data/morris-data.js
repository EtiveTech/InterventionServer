$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2014 Q1',
            data1: 2666,
            data2: null,
            data3: 2647
        }, {
            period: '2014 Q2',
            data1: 2778,
            data2: 2294,
            data3: 2441
        }, {
            period: '2014 Q3',
            data1: 4912,
            data2: 1969,
            data3: 2501
        }, {
            period: '2014 Q4',
            data1: 3767,
            data2: 3597,
            data3: 5689
        }, {
            period: '2015 Q1',
            data1: 6810,
            data2: 1914,
            data3: 2293
        }, {
            period: '2015 Q2',
            data1: 5670,
            data2: 4293,
            data3: 1881
        }, {
            period: '2015 Q3',
            data1: 4820,
            data2: 3795,
            data3: 1588
        }, {
            period: '2015 Q4',
            data1: 15073,
            data2: 5967,
            data3: 5175
        }, {
            period: '2016 Q1',
            data1: 10687,
            data2: 4460,
            data3: 2028
        }, {
            period: '2016 Q2',
            data1: 8432,
            data2: 5713,
            data3: 1791
        }],
        xkey: 'period',
        ykeys: ['data1', 'data2', 'data3'],
        labels: ['data1', 'data2', 'data3'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });
    
});
