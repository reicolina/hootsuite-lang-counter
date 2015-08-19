/*jslint browser:true */
/*global $, Highcharts, io */
'use strict';

(function () {

var clients = [],
  languages = [],
  newCount = [],
  newVerifiedCount = [],
  chart;

// set up highcharts bar chart
$(document).ready(function () {
  chart = new Highcharts.Chart({
    chart: {
      type: 'bar',
      renderTo: 'container'
    },
    title: {
      text: 'Preferred Language for Latests Tweets from Hootsuite'
    },
    xAxis: {
        categories: languages,
        title: {
            text: 'Languages'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Owls (Hootsuite Users)',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    series: [{name: 'Total Owls', data: [], color: '#71685F'}, {name: 'Famous Owls', data: [], color: '#FFBD0A'}]
  });

  var socket = io.connect();
  var found;

  // handle the incoming data from the socket
  socket.on('tweet', function (client) {
    found = false;
    for(var i in languages) {
      if(clients[i].language === client.language) {
        clients[i].count++;
        if (client.isVerified) {
          clients[i].verifiedCount++;
        }
        found = true;
      }
    }
    if(!found) {
      languages.push(client.language);
      clients.push({language: client.language, count: 1, verifiedCount: client.isVerified && 1});
    }

  });
});

function refresh () {
  for(var i in clients) {
      newCount.push(clients[i].count);
      newVerifiedCount.push(clients[i].verifiedCount);
  }
  chart.xAxis[0].setCategories(languages);
  chart.series[0].setData(newCount);
  chart.series[1].setData(newVerifiedCount);
  chart.redraw();
  newCount = [];
  newVerifiedCount = [];
  setTimeout(refresh, 500);
}

// refresh the view every half a second
setTimeout(refresh, 500);

})();
