'use strict';

function loadMap(element) {
    if (!element.data('leaflet')) {
        var map = new L.Map(element.attr('id'));

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
            maxZoom: 18
        }).addTo(map);

        map.attributionControl.setPrefix('');

        element.data('leaflet', map);
    }

    return element.data('leaflet');
}

$(document).ready(function() {
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
        return Highcharts.Color(color).setOpacity(1).get('rgba');
    });

    var monthNames = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Jui', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

    var hcSettings = {
        chart: {
            renderTo: 'chart',
            type: 'areaspline',
            backgroundColor: 'rgba(255,255,255,0.4)'
        },
        title: {
            text: 'Dernières activités publique sur Github'
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: 'Commits'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' commits'
        },
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.9
            }
        },
        series: [{
            name: 'Github commits',
            data: []
        }]
    };

    $.getJSON('/data/scripts/github_stats.json', function(data) {
        for (var year in data) {
            var months = Object.keys(data[year]).sort();
            var yearCommits = data[year];

            for (var key in months) {
                var month = months[key];
                var commits = yearCommits[month];

                hcSettings.xAxis.categories.push(monthNames[parseInt(month) - 1]);
                hcSettings.series[0].data.push(commits);
            }
        }

        new Highcharts.Chart(hcSettings);
    });

    function hideAll() {
        $('#home, #contact, #projects').hide();
        $('#menu button').removeClass('active');
    }

    $('#menu .link-project').bind('click', function() {
        hideAll();
        $('#projects').show();
        $(this).addClass('active');
    });

    $('#menu .link-home').bind('click', function() {
        hideAll();
        $('#home').show();
        $(this).addClass('active');
    });

    $('#menu .link-contact').bind('click', function() {
        hideAll();
        $('#contact').show();
        $(this).addClass('active');

        loadMap($('#map')).setView(new L.LatLng(48.44, 1.48), 13);
    });
});
