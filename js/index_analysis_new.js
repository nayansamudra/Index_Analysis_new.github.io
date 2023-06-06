root = "https://students.tradingcafeindia.com/tc_indicator"

// Check Access API
function call_check_access_API(user) {
  try {
    $.post("https://tredcode.tradingcafeindia.com/dhan/check_access", { email: user }, function (data, status) {
      Check_Access_data = data;
    }
    ).fail(function (response) {
      console.log('Error: ' + response);
    });

    if (Check_Access_data != "Authorised") {
      $('.finnifty_btn').attr('id', 'unAuth_finnifty_btn')
      $('#unAuth_finnifty_btn').text('GET FINNIFTY')
    }
  } catch (error) {
    console.error()
  }
}

// Expiry API
function call_Expiry_API(script, user, abc) {
  try {
    $.post(
      root + "/get_running_expiry",
      { script: script, email: user, auth: abc },
      function (data, status) {
        Expiry_data = data;
      }
    ).fail(function (response) {
      console.log('Error: ' + response);
    });
    let x = moment.unix(Expiry_data[0][0]).format("MMM-DD");
    let y = moment.unix(Expiry_data[1][0]).format("MMM-DD");
    $("#1st_dropdown_value").attr("value", x);
    $("#2nd_dropdown_value").attr("value", y);
    $("#1st_dropdown_value").text(x);
    $("#2nd_dropdown_value").text(y);
    Nifty_exp_1 = moment.unix(Expiry_data[0][0]).format("DDMMMYY");
    Nifty_exp_2 = moment.unix(Expiry_data[1][0]).format("DDMMMYY");
    return [Expiry_data, Nifty_exp_1, Nifty_exp_2];
  } catch (error) {
    console.error()
  }
}

// LIVE OI API
function call_LIVE_OI_API(script, exp, user, abc) {
  try {
    $.post(
      root + "/live_oi",
      { script: script, exp: exp, email: user, auth: abc },
      function (data, status) {
        Live_OI_data = data;
      }
    ).fail(function (response) {
      console.log('Error: ' + response);
    });
    ts_2 = Object.keys(Live_OI_data)[0]
    $('#c_chart_last_upd').text(`${moment.unix(ts_2).format("hh:mm")}`)
    return [Live_OI_data, ts2]
  } catch (error) {
    console.error()
  }
}

// Function for timestamp 1 
function timestamp_1() {
  ts2 = Object.keys(Live_OI_data)[0]

  year = moment.unix(parseFloat(ts2)).year()
  month = moment.unix(parseFloat(ts2)).month()
  day = moment.unix(parseFloat(ts2)).date()

  const dateTime = moment();
  dateTime.set({ year: year, month: month, date: day, hour: 9, minute: 15, second: 0, millisecond: 0 });
  ts1 = dateTime.unix();
  ts1 = parseFloat(ts1).toFixed(1)
}

// INDEX OI CHANGE API
function call_INDEX_OI_CHANGE_API(ts1, ts2, script, exp, user, abc) {
  try {
    $.post(
      root + "/index_analysis",
      { ts1: ts1, ts2: ts2, script: script, exp: exp, email: user, auth: abc },
      function (data, status) {
        Index_OI_Change_data = data;
      }
    ).fail(function (response) {
      console.log('Error: ' + response);
      Index_OI_Change_data = 0
    });
  } catch (error) {
    console.error()
    Index_OI_Change_data = 0
  }
}

// Calculation for data of NIFTY 50 Open Interest Tracker
function NIFTY_50_Open_Intrest_Tracker(script) {
  let array = Object.keys(Object.values(Live_OI_data)[0])
  let processedArray = array.slice(0, array.length - 1);
  let newArray = $.map(processedArray, function (element) {
    if (script == "NIFTY 50") {
      return element.slice(14, -2);
    }
    else if (script == "NIFTY BANK") {
      return element.slice(18, -2);
    }
    else if (script == "NIFTY FIN SERVICE") {
      return element.slice(17, -2);
    }
  });
  let uniqueArray = $.unique(newArray);
  x_axis_categories = uniqueArray

  let Dict = Object.values(Live_OI_data)[0]

  CE_array = [];
  PE_array = [];

  $.each(Dict, function (key, value) {
    if (key.indexOf("CE") !== -1) {
      CE_array.push(value);
    } else if (key.indexOf("PE") !== -1) {
      PE_array.push(value);
    }
  });

  CE_OI_total = CE_array.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  PE_OI_total = PE_array.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue;
  }, 0);

  Open_Intrest_Tracker_atm = `${Object.values(Live_OI_data)[0]['atm']}`

  $('.total_ce').text(CE_OI_total)
  $('.total_pe').text(PE_OI_total)
  $('.pcr_net').text(`${parseFloat(PE_OI_total / CE_OI_total).toFixed(2)}`)
}

// Calculation for data of OI Compass
function OI_Compass(script) {
  if (Index_OI_Change_data != 0) {

    let array_2 = Object.values(Index_OI_Change_data);
    var commonKeys = Object.keys(array_2[0]);
    // Get the common keys from all dictionaries in the array
    var commonKeys = array_2.reduce(function (keys, obj) {
      return Object.keys(obj).filter(function (key) {
        return keys.includes(key);
      });
    }, Object.keys(array_2[0]));
    // Perform intersection for each dictionary in the array
    Index_OI_final_Change_data = array_2.map(function (obj) {
      var intersection = {};
      commonKeys.forEach(function (key) {
        if (key in obj) {
          intersection[key] = obj[key];
        }
      });
      return intersection;
    });


    let array = Object.keys(Object.values(Index_OI_final_Change_data)[0])
    let processedArray = array.slice(0, array.length - 1);
    let newArray = $.map(processedArray, function (element) {
      if (script == "NIFTY 50") {
        return element.slice(14, -2);
      }
      else if (script == "NIFTY BANK") {
        return element.slice(18, -2);
      }
      else if (script == "NIFTY FIN SERVICE") {
        return element.slice(17, -2);
      }
    });
    let uniqueArray = $.unique(newArray);
    x_axis_categories_OI_Compass = uniqueArray

    let my_array = x_axis_categories_OI_Compass;
    let reversed_array = $([].concat(my_array)).toArray().reverse();
    x_axis_categories_OI_Compass = reversed_array

    let array_1 = Object.values(Index_OI_final_Change_data)
    Diff_Result = {};
    for (let key in array_1[0]) {
      if (array_1[0].hasOwnProperty(key) && array_1[1].hasOwnProperty(key)) {
        let diff = array_1[1][key] - array_1[0][key];
        Diff_Result[key] = diff;
      }
    }


    let Dict = Diff_Result
    CE_array_OI_Compass = [];
    PE_array_OI_Compass = [];

    $.each(Dict, function (key, value) {
      if (key.indexOf("CE") !== -1) {
        CE_array_OI_Compass.push(value);
      } else if (key.indexOf("PE") !== -1) {
        PE_array_OI_Compass.push(value);
      }
    });

    let my_array_1 = CE_array_OI_Compass;
    let reversed_array_1 = $([].concat(my_array_1)).toArray().reverse();
    CE_array_OI_Compass = reversed_array_1

    let my_array_2 = PE_array_OI_Compass;
    let reversed_array_2 = $([].concat(my_array_2)).toArray().reverse();
    PE_array_OI_Compass = reversed_array_2

    OI_Compass_atm_1 = `${Object.values(Index_OI_Change_data)[0]['atm']}`
    // OI_Compass_atm_2 = `${Object.values(Index_OI_Change_data)[1]['atm']}`
    // if (OI_Compass_atm_1 == OI_Compass_atm_2) {
    //   OI_Compass_atm_Final = OI_Compass_atm_1
    // } else {
    OI_Compass_atm_Final = OI_Compass_atm_1
    // }

  }
}

// Calculation for Change in P/C
function Changes_in_Put_Call() {
  if (Index_OI_Change_data != 0) {

    let array = Object.values(Index_OI_final_Change_data)

    // Calculate ts1_CE_Total
    let ts1_CE_Total = 0;
    for (let key in array[0]) {
      if (key.endsWith('CE')) {
        ts1_CE_Total += array[0][key];
      }
    }

    // Calculate ts2_CE_Total
    let ts2_CE_Total = 0;
    for (let key in array[1]) {
      if (key.endsWith('CE')) {
        ts2_CE_Total += array[1][key];
      }
    }

    // Calculate Change_CE_OI
    Change_CE_OI = ts2_CE_Total - ts1_CE_Total;

    // Calculate ts1_PE_Total
    let ts1_PE_Total = 0;
    for (let key in array[0]) {
      if (key.endsWith('PE')) {
        ts1_PE_Total += array[0][key];
      }
    }

    // Calculate ts2_PE_Total
    let ts2_PE_Total = 0;
    for (let key in array[1]) {
      if (key.endsWith('PE')) {
        ts2_PE_Total += array[1][key];
      }
    }

    // Calculate Change_PE_OI
    Change_PE_OI = ts2_PE_Total - ts1_PE_Total;

    $('.chg_ce').text(Change_CE_OI)
    $('.chg_pe').text(Change_PE_OI)
  }
}

function fetch_data() {
  // Getting Timestamp from ion Range slider
  let irs_data = $(".js-range-slider").data("ionRangeSlider");
  from_t = moment(irs_data.old_from).unix(), to_t = moment(irs_data.old_to).unix();
  ts1 = parseFloat(from_t).toFixed(1), ts2 = parseFloat(to_t).toFixed(1);

  var x1 = moment.unix(parseFloat(Object.keys(Live_OI_data)[0])).format('DD-MM-YYYY')
  var y1 = moment.unix(parseFloat(ts1)).format('HH:mm:ss:SSS')
  var y2 = moment.unix(parseFloat(ts2)).format('HH:mm:ss:SSS')

  var datetime_1 = moment(x1 + ' ' + y1, 'DD-MM-YYYY HH:mm:ss:SSS');
  var datetime_2 = moment(x1 + ' ' + y2, 'DD-MM-YYYY HH:mm:ss:SSS');
  ts1 = datetime_1.valueOf(), ts1 = moment(ts1).unix(), ts1 = parseFloat(ts1).toFixed(1);
  ts2 = datetime_2.valueOf(), ts2 = moment(ts2).unix(), ts2 = parseFloat(ts2).toFixed(1);

  var x = $("#Expiry").prop("selectedIndex");

  if ($("#nifty_btn").hasClass("gb_active") && x == 1) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_2, user, abc)
    OI_Compass("NIFTY 50")
    Changes_in_Put_Call()
    update_chart()
  } else if ($("#nifty_btn").hasClass("gb_active") && x == 0) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_1, user, abc)
    OI_Compass("NIFTY 50")
    Changes_in_Put_Call()
    update_chart()
  } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 1) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY BANK", Nifty_exp_2, user, abc)
    OI_Compass("NIFTY BANK")
    Changes_in_Put_Call()
    update_chart()
  } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 0) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY BANK", Nifty_exp_1, user, abc)
    OI_Compass("NIFTY BANK")
    Changes_in_Put_Call()
    update_chart()
  } else if ($("#finnifty_btn").hasClass("gb_active") && x == 1) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY FIN SERVICE", Nifty_exp_2, user, abc)
    OI_Compass("NIFTY FIN SERVICE")
    Changes_in_Put_Call()
    update_chart()
  } else if ($("#finnifty_btn").hasClass("gb_active") && x == 0) {
    call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY FIN SERVICE", Nifty_exp_1, user, abc)
    OI_Compass("NIFTY FIN SERVICE")
    Changes_in_Put_Call()
    update_chart()
  }
}

function update_chart() {
  chart.updateOptions({
    xaxis: {
      categories: x_axis_categories_OI_Compass
    },
    annotations: {
      yaxis: [{
        y: OI_Compass_atm_Final,
        offsetX: 0,
        offsetY: -3,
        borderColor: "#ffffff",
        label: {
          style: {
            color: "#123"
          },
          text: "ATM"
        }
      }]
    }
  }), chart.updateSeries([{
    name: "Call OI",
    data: CE_array_OI_Compass
  }, {
    name: "Put OI",
    data: PE_array_OI_Compass
  }])

  chart1.updateSeries([{
    name: "OI Chng",
    data: [Change_PE_OI, Change_CE_OI]
  }])

  $("#donutchart path:eq(1)").css("fill", "#ff5253")
  Change_PE_OI > 0 ? $("#donutchart path:eq(0)").css("fill", "#00d3c0") : $("#donutchart path:eq(0)").css("fill", "#ff5253"),
    Change_CE_OI > 0 ? $("#donutchart path:eq(1)").css("fill", "#ff5253") : $("#donutchart path:eq(1)").css("fill", "#00d3c0")
}

function update_chart_set_interval() {
  c_chart.updateOptions({
    annotations: {
      xaxis: [{
        x: Open_Intrest_Tracker_atm,
        offsetX: -1,
        offsetY: 0,
        borderColor: "#ffffff",
        label: {
          style: {
            color: "#123"
          },
          orientation: "horizontal",
          text: "ATM"
        }
      }]
    },
    xaxis: {
      categories: x_axis_categories
    }
  }), c_chart.updateSeries([{
    name: "Call OI",
    data: CE_array
  }, {
    name: "Put OI",
    data: PE_array
  }])

  chart2.updateSeries([PE_OI_total, CE_OI_total])
}

function updateSlider(fromValue, toValue) {
  slider.update({
    from: fromValue,
    to: toValue
  });
}

$(document).ready(function () {

  console.log = function () { };

  $.ajaxSetup({ async: false }); // to stop async

  user = "dknaix@gmail.com"

  abc = "";
  function Auth_User(auth) {
    $.post(
      root + "/auth",
      { email: auth },
      function (data, status) {
        abc = data
      }
    ).fail(function (response) {
      console.log('Error: ' + response);
    });
  }
  Auth_User(user)

  Index_OI_Change_data = 0;
  Change_PE_OI = 0;
  Change_CE_OI = 0;
  CE_array_OI_Compass = [0, 0]
  PE_array_OI_Compass = [0, 0]
  x_axis_categories_OI_Compass = [0, 0]
  OI_Compass_atm_Final = 0
  CE_array = [0, 0]
  PE_array = [0, 0]
  x_axis_categories = 0
  Open_Intrest_Tracker_atm = 0
  PE_OI_total = 0
  CE_OI_total = 0
  Change_PE_OI = 0
  Change_CE_OI = 0

  slider = $(".js-range-slider").ionRangeSlider({
    grid: true,
    type: "double",
    min: moment("0915", "hhmm").valueOf(),
    max: moment("1530", "hhmm").valueOf(),
    from: moment("0915", "hhmm").valueOf(),
    to: moment("1530", "hhmm").valueOf(),
    force_edges: !0,
    grid_num: 12,
    step: 180000,
    min_interval: 180000,
    prettify: function (t) {
      return moment(t).format("HH:mm")
    }
  }).data("ionRangeSlider");

  call_check_access_API(user)
  call_Expiry_API("NIFTY 50", user, abc);
  call_LIVE_OI_API("NIFTY 50", Nifty_exp_1, user, abc)
  timestamp_1() // Calculating ts1 and ts2
  NIFTY_50_Open_Intrest_Tracker("NIFTY 50")

  // Grouped Column Bar Chart
  var options = {
    grid: {
      borderColor: "#2e2e2e"
    },
    responsive: [{
      breakpoint: 800,
      options: {
        dataLabels: {},
        plotOptions: {
          bar: {
            horizontal: !1,
            columnWidth: "75%",
            endingShape: "rounded"
          }
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
            align: 'left',
            rotate: 270
          }
        }
      }
    }],
    colors: ["#ff5253", "#00d3c0"],
    legend: {
      fontSize: "16px",
      labels: {
        colors: ["#ffffff"]
      }
    },
    series: [{
      name: "Call OI",
      data: CE_array
    }, {
      name: "Put OI",
      data: PE_array
    }],
    chart: {
      toolbar: {
        show: !1
      },
      toolbar: {
        show: !0,
        tools: {
          download: !1,
          selection: !0,
          zoom: !0,
          zoomin: !0,
          zoomout: !0,
          pan: !0,
          reset: 1,
          customIcons: []
        }
      },
      foreColor: "#ffffff",
      type: "bar",
      height: 530
    },
    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "30%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      show: !0,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      tickPlacement: "on",
      categories: x_axis_categories,
      title: {
        style: {
          fontSize: "1rem",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-title"
        }
      }
    },
    yaxis: {
      title: {
        text: "Open Interest",
        style: {
          fontSize: "1rem",
          fontWeight: 600,
          cssClass: "apexcharts-xaxis-title"
        }
      }
    },
    annotations: {
      xaxis: [{
        x: Open_Intrest_Tracker_atm,
        borderColor: '#999',
        borderType: 'dotted',
        borderWidth: 1,
        label: {
          style: {
            color: '#000'
          },
          text: 'ATM',
          position: 'top',
          orientation: 'horizontal',
        }
      }]
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (t) {
          return t
        }
      }
    }
  };
  c_chart = new ApexCharts(document.querySelector("#column_chart"), options), c_chart.render();

  // Donut Chart
  var options1 = {
    chart: {
      type: "donut",
      width: '220',
      height: '220'
    },
    responsive: [{
      breakpoint: 1150,
      options: {
        chart: {
          width: '200',
          height: '200',
        },
        dataLabels: {
          offsetX: 5,
          offsetY: 0,
          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold"
          }
        }
      }
    }, {
      breakpoint: 992,
      options: {
        chart: {
          width: '250',
          height: '250',
        },
        dataLabels: {
          offsetX: 5,
          offsetY: 0,
          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold"
          }
        }
      }
    }, {
      breakpoint: 800,
      options: {
        chart: {
          width: '200',
          height: '200',
        },
        dataLabels: {
          offsetX: 5,
          offsetY: 0,
          style: {
            fontSize: "10px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold"
          }
        }
      }
    }],
    series: [PE_OI_total, CE_OI_total],
    labels: ["Total PE OI", "Total CE OI"],
    backgroundColor: "transparent",
    pieHole: .5,
    colors: ["#00d3c0", "#ff5253"],
    pieSliceTextStyle: {
      color: "#ffffff"
    },
    sliceVisibilityThreshold: 0,
    fontSize: 17,
    chartArea: {
      top: 40
    },
    pieSliceTextStyle: {
      fontSize: 12
    },
    pieStartAngle: 50,
    isStacked: !0,
    enableInteractivity: !1,
    pieSliceBorderColor: "transparent",
    legend: {
      show: !1,
      position: "right",
      horizontalAlign: "right",
      labels: {
        colors: "#ffffff",
        useSeriesColors: !1
      },
      itemMargin: {
        horizontal: 10,
        vertical: 20
      },
      fontSize: 15,
      markers: {
        width: 12,
        height: 12,
        radius: 12
      }
    },
    stroke: {
      colors: "trasparant",
      width: 0
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        expandOnClick: !0,
        offsetX: 0,
        offsetY: 25,
        customScale: 1.1,
        dataLabels: {
          position: "right",
          offset: 0,
          minAngleToShowLabel: 50
        },
        grid: {
          borderColor: "#000000"
        },
        donut: {
          size: "70%",
          labels: {
            colors: "#ffffff",
            show: !0,
            name: {
              color: "#ffffff",
              fontSize: 14
            },
            value: {
              color: "#ffffff",
              fontSize: 14
            },
            total: {
              color: "#ffffff"
            }
          }
        }
      }
    }
  };
  chart2 = new ApexCharts(document.querySelector("#donutchart1"), options1), chart2.render();

  call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_1, user, abc)
  // Index_OI_Change_data = {1685936700.0 : {'NFO:NIFTY2360818100CE': 1418, 'NFO:NIFTY2360818100PE': 67153, 'NFO:NIFTY2360818150CE': 497, 'NFO:NIFTY2360818150PE': 38517, 'NFO:NIFTY2360818200CE': 4853}}
  OI_Compass("NIFTY 50")
  Changes_in_Put_Call()

  let today = moment();
  let todays_day = today.format('DD-MM-YYYY')
  let API_day = moment.unix(Object.keys(Live_OI_data)[0]).format('DD-MM-YYYY')
  if (todays_day == API_day) {
    updateSlider("9:15", new Date().getTime())
  } else {
    updateSlider("9:15", "15:30")
  }

  // Grouped Horizontal Bar Chart 
  var options = {
    series: [{
      name: "Call OI",
      data: CE_array_OI_Compass
    }, {
      name: "Put OI",
      data: PE_array_OI_Compass
    }],
    chart: {
      type: 'bar',
      height: "625px",
      toolbar: {
        show: false,
      },
      foreColor: "#000",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetX: 35,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },
    stroke: {
      show: false,
    },
    tooltip: {
      shared: !1,
      intersect: !0,
      style: {
        fontSize: '12px',
        color: ['#333']
      },
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: x_axis_categories_OI_Compass,
      colors: ["#fff"],
      labels: {
        style: {
          fontSize: "14px"
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (t) {
          return Math.floor(t)
        },
        style: {
          fontSize: "14px"
        }
      }
    },
    annotations: {
      yaxis: [{
        y: OI_Compass_atm_Final,
        offsetX: 0,
        offsetY: -3,
        borderColor: "#ffffff",
        label: {
          style: {
            color: "#123"
          },
          text: "ATM"
        }
      }]
    },
    grid: {
      show: false
    },
    colors: ["#ff5253", "#00d3c0"]
  };
  chart = new ApexCharts(document.querySelector("#grouped_barchart"), options), chart.render();

  // Bar Chart
  var donut_bar = {
    responsive: [{
      breakpoint: 800,
      options: {
        chart: {
          height: "auto"
        }
      }
    }],
    grid: {
      borderColor: "#2e2e2e"
    },
    colors: ["#00d3c0", "#ff5253"],
    series: [{
      name: "OI Chng",
      data: [Change_PE_OI, Change_CE_OI]
    }],
    chart: {
      type: "bar",
      height: "95%",
      toolbar: {
        show: !1
      },
      foreColor: "#ffffff"
    },
    plotOptions: {
      bar: {
        horizontal: !1,
        columnWidth: "45%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: !1
    },
    stroke: {
      show: !0,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: ["PE Chg", "CE Chg"]
    },
    yaxis: {
      title: {}
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (t) {
          return t
        }
      }
    }
  };
  chart1 = new ApexCharts(document.querySelector("#donutchart"), donut_bar), chart1.render();

  $("#donutchart path:eq(1)").css("fill", "#ff5253")
  Change_PE_OI > 0 ? $("#donutchart path:eq(0)").css("fill", "#00d3c0") : $("#donutchart path:eq(0)").css("fill", "#ff5253"),
    Change_CE_OI > 0 ? $("#donutchart path:eq(1)").css("fill", "#ff5253") : $("#donutchart path:eq(1)").css("fill", "#00d3c0");

  // On click Function of 3 BUTTONS [NIFTY 50, NIFTY BANK, NIFTY FIN SERVICE]
  $("#nifty_btn").click(function () {
    $('#Candlestick_title').text('Nifty 50')
    Index_OI_Change_data = 0;
    Change_PE_OI = 0;
    Change_CE_OI = 0;
    CE_array_OI_Compass = [0, 0]
    PE_array_OI_Compass = [0, 0]
    x_axis_categories_OI_Compass = [0, 0]
    OI_Compass_atm_Final = 0
    CE_array = [0, 0]
    PE_array = [0, 0]
    x_axis_categories = 0
    Open_Intrest_Tracker_atm = 0
    PE_OI_total = 0
    CE_OI_total = 0
    Change_PE_OI = 0
    Change_CE_OI = 0
    $("#nifty_btn").addClass("gb_active");
    $("#bnknifty_btn").removeClass("gb_active");
    $("#finnifty_btn").removeClass("gb_active");
    // $("#Expiry").prop("selectedIndex", 0);

    call_Expiry_API("NIFTY 50", user, abc);

    var x = $("#Expiry").prop("selectedIndex");
    if ($("#nifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_2, user, abc)
    } else if ($("#nifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_1, user, abc)
    }

    // call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_1)
    NIFTY_50_Open_Intrest_Tracker("NIFTY 50")
    // OI_Compass("NIFTY 50")
    // Changes_in_Put_Call()
    // update_chart()
    update_chart_set_interval()

    $('#col_barchart_name').text('Nifty 50 Open Interest Tracker');

    fetch_data()
  });
  $("#bnknifty_btn").click(function () {
    $('#Candlestick_title').text('Nifty Bank')
    Index_OI_Change_data = 0;
    Change_PE_OI = 0;
    Change_CE_OI = 0;
    CE_array_OI_Compass = [0, 0]
    PE_array_OI_Compass = [0, 0]
    x_axis_categories_OI_Compass = [0, 0]
    OI_Compass_atm_Final = 0
    CE_array = [0, 0]
    PE_array = [0, 0]
    x_axis_categories = 0
    Open_Intrest_Tracker_atm = 0
    PE_OI_total = 0
    CE_OI_total = 0
    Change_PE_OI = 0
    Change_CE_OI = 0
    $("#nifty_btn").removeClass("gb_active");
    $("#bnknifty_btn").addClass("gb_active");
    $("#finnifty_btn").removeClass("gb_active");
    // $("#Expiry").prop("selectedIndex", 0);

    call_Expiry_API("NIFTY BANK", user, abc);
    var x = $("#Expiry").prop("selectedIndex");
    if ($("#bnknifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_2, user, abc)
    } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_1, user, abc)
    }
    // call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY BANK", Nifty_exp_1)
    NIFTY_50_Open_Intrest_Tracker("NIFTY BANK")
    // OI_Compass("NIFTY BANK")
    // Changes_in_Put_Call()
    // update_chart()
    update_chart_set_interval()

    $('#col_barchart_name').text('Banknifty Open Interest Tracker');
    fetch_data()
  });
  $("#finnifty_btn").click(function () {
    $('#Candlestick_title').text('Nifty Fin Service')
    Index_OI_Change_data = 0;
    Change_PE_OI = 0;
    Change_CE_OI = 0;
    CE_array_OI_Compass = [0, 0]
    PE_array_OI_Compass = [0, 0]
    x_axis_categories_OI_Compass = [0, 0]
    OI_Compass_atm_Final = 0
    CE_array = [0, 0]
    PE_array = [0, 0]
    x_axis_categories = 0
    Open_Intrest_Tracker_atm = 0
    PE_OI_total = 0
    CE_OI_total = 0
    Change_PE_OI = 0
    Change_CE_OI = 0
    $("#nifty_btn").removeClass("gb_active");
    $("#bnknifty_btn").removeClass("gb_active");
    $("#finnifty_btn").addClass("gb_active");
    // $("#Expiry").prop("selectedIndex", 0);

    call_Expiry_API("NIFTY FIN SERVICE", user, abc);
    var x = $("#Expiry").prop("selectedIndex");
    if ($("#finnifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_2, user, abc)
    } else if ($("#finnifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_1, user, abc)
    }
    // call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY FIN SERVICE", Nifty_exp_1)
    NIFTY_50_Open_Intrest_Tracker("NIFTY FIN SERVICE")
    // OI_Compass("NIFTY FIN SERVICE")
    // Changes_in_Put_Call()
    // update_chart()
    update_chart_set_interval()

    $('#col_barchart_name').text('Finnifty Open Interest Tracker');
    fetch_data()
  });
  $("#unAuth_finnifty_btn").click(function () {
    window.location.href = "https://tredcode.tradingcafeindia.com/dashboard/trade-with-tredcode";
  });

  //Expiry Change
  $("#Expiry").change(function () {
    var x = $("#Expiry").prop("selectedIndex");
    if ($("#nifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_2, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY 50")
      OI_Compass("NIFTY 50")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    } else if ($("#nifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_1, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY 50", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY 50")
      OI_Compass("NIFTY 50")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_2, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY BANK", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY BANK")
      OI_Compass("NIFTY BANK")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_1, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY BANK", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY BANK")
      OI_Compass("NIFTY BANK")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    } else if ($("#finnifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_2, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY FIN SERVICE", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY FIN SERVICE")
      OI_Compass("NIFTY FIN SERVICE")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    } else if ($("#finnifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_1, user, abc)
      call_INDEX_OI_CHANGE_API(ts1, ts2, "NIFTY FIN SERVICE", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY FIN SERVICE")
      OI_Compass("NIFTY FIN SERVICE")
      Changes_in_Put_Call()
      update_chart()
      update_chart_set_interval()
    }
  })

  // SetInterval after 3 min
  setInterval(() => {
    var x = $("#Expiry").prop("selectedIndex");
    if ($("#nifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY 50")
      update_chart_set_interval()
    } else if ($("#nifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY 50", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY 50")
      update_chart_set_interval()
    } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY BANK")
      update_chart_set_interval()
    } else if ($("#bnknifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY BANK", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY BANK")
      update_chart_set_interval()
    } else if ($("#finnifty_btn").hasClass("gb_active") && x == 1) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_2, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY FIN SERVICE")
      update_chart_set_interval()
    } else if ($("#finnifty_btn").hasClass("gb_active") && x == 0) {
      call_LIVE_OI_API("NIFTY FIN SERVICE", Nifty_exp_1, user, abc)
      NIFTY_50_Open_Intrest_Tracker("NIFTY FIN SERVICE")
      update_chart_set_interval()
    }
  }, 180000);
})
