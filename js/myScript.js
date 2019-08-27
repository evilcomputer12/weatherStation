function getDataForCity(method, position) {
    var url = '';
    switch (method) {
        case 1:
            var city = $('#search-input').val();
            url = 'http://api.openweathermap.org/data/2.5/weather?q=' +
                city +
                '&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
            break;
        case 2:
            var pos = position;
            url = 'http://api.openweathermap.org/data/2.5/weather?lat='
                + pos.coords.latitude +
                '&lon=' + pos.coords.longitude +
                '&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
            break;
        case 3:
            var city = $('#input-start').val();
            url = 'http://api.openweathermap.org/data/2.5/weather?q=' +
                city +
                '&units=metric&APPID=e1f9f02ede94a68151d5da6526adf447';
            break;
        default:
            alert('Invalid method id in getDataForCity function');
    }

    $.get(url, function (data) {


        $('#cityName').html(data.name);
        $('#state').html(getCountryName(data.sys.country));

        var date = new Date(data.dt * 1000);
        $('#dateTime').html(date.toUTCString());

        $('#weather-description img').attr('src', 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
        $('#weather-description span').html(data.weather[0].description);
        $('.max').html(data.main.temp_max);
        $('.min').html(data.main.temp_min);
        $('#temp-value').html(parseInt(data.main.temp));

        $('#could-coverage .details-info').html(data.clouds.all);
        $('#pressure .details-info').html(data.main.pressure);
        var vis = parseFloat(data.visibility).toFixed(2) / 1000;
        $('#visibility .details-info').html(vis);
        $('#humidity .details-info').html(data.main.humidity);

        var sunrise = new Date(data.sys.sunrise * 1000);
        $('#sunrise .details-info').html(formatNumber(sunrise.getHours()) + ':' + formatNumber(sunrise.getMinutes()) + ':' + formatNumber(sunrise.getSeconds()));

        var sunset = new Date(data.sys.sunset * 1000);
        $('#sunrise .details-info').html(formatNumber(sunrise.getHours()) + ':' + formatNumber(sunrise.getMinutes()) + ':' + formatNumber(sunrise.getSeconds()));
        $('#sunset .details-info').html(formatNumber(sunset.getHours()) + ':' + formatNumber(sunset.getMinutes()) + ':' + formatNumber(sunset.getSeconds()));

        $('#degrees .details-info').html(data.wind.deg);
        $('#speed .details-info').html(data.wind.speed);

        var latitude = data.coord.lat;
        var longitude = data.coord.lon;

        $('.map img').attr('src', 'https://maps.googleapis.com/maps/api/staticmap?center=' + latitude + ',' + longitude + '&zoom=13&scale=1&size=555x406&maptype=roadmap&key=AIzaSyB1clf7Qj9njxltXBOESK2xqKsydWjqLhs&format=png&visual_refresh=true');

        var id = data.weather[0].id;

        var a = parseInt(id / 100);
        var b = parseInt(id / 10);
        if (id == 800) {
            $('body').css('background-image', 'url("./img/800.jpg")');
        } else if (b == 90) {
            $('body').css('background-image', 'url("./img/90.jpg")');
        } else if (b == 80) {
            $('body').css('background-image', 'url("./img/80.jpg")');
        } else if (a == 7) {
            $('body').css('background-image', 'url("./img/7.jpg")');
        } else if (a == 6) {
            $('body').css('background-image', 'url("./img/6.jpg")');
        } else if (a == 5) {
            $('body').css('background-image', 'url("./img/5.jpg")');
        } else if (a == 3) {
            $('body').css('background-image', 'url("./img/3.jpg")');
        } else if (a == 2) {
            $('body').css('background-image', 'url("./img/2.jpg")');
        } else {
            $('body').css('background-image', 'url("./img/other.jpg")');
        }

        $('#splash_screen').hide();
    })
}

function getCountryName(countryCode) {

    var index = 0;
    var found;
    var entry;
    for (index = 0; index < countries.length; ++index) {
        entry = countries[index];
        if (entry.code == countryCode) {
            found = entry.name;
            break;
        }
    }
    return found;
}

function getLocation() {
    navigator.permissions.query({ name: 'geolocation' })
        .then(function (permissionStatus) {
            console.log('geolocation permission state is ', permissionStatus.state);
            permissionStatus.state = 'granted';

            permissionStatus.onchange = function () {
                console.log('geolocation permission state has changed to ', this.state);
            };
        });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showSearchBar);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    getDataForCity(2, position);
}

function showSearchBar() {
    $('#splash_screen').html(`
            <div class="container" style="background:none;">
        <h1>Ве молиме пребарајте град или држава</h1>
        <form>
            <div class="form-group">
                <input type="text" id="input-start" class="form-control " />
            </div>
            <button type="button" id="btn-start" class="btn btn-default ">
                Пребарај
            </button>
        </form>
    </div>
    <script>

        $('#input-start').autocomplete({
            source: function (request, response) {
                var results = $.ui.autocomplete.filter(citiesNames, request.term);
                if (results.length > 10) {
                    response(results.slice(0, 10));
                } else {
                    response(results);
                }

            },
            delay: 400,
            select: function (event, ui) {
                // To be searched with ID for more precision
                var index = citiesNames.indexOf(ui.item.value);
                //console.log(cities[index].id);
            }
        });

        $('#btn-start').on('click', function (event) {
            getDataForCity(3);
        });

        $('#input-start').keydown(function (event) {
            var keyCode = (event.keyCode ? event.keyCode : event.which);
            if (keyCode == 13) {
                getDataForCity(3);
            }
        });
    </script>
    `
    );
}

function formatNumber(n) {
    return n > 9 ? "" + n : "0" + n;
}

$('#btn-search').on('click', function (event) {
    getDataForCity(1);
});

$('#search-input').keydown(function (event) {
    var keyCode = (event.keyCode ? event.keyCode : event.which);
    if (keyCode == 13) {
        getDataForCity(1);
    }
});

$('#btn-locate').on('click', function (event) {
    getLocation();
});

$(function () {
    getLocation();
})

var citiesNames = new Array();
Object.keys(cities).forEach(function (key) {
    //get the value of name
    var val = cities[key]["name"];
    //push the name string in the array
    citiesNames.push(val);
});

$('#search-input').autocomplete({
    source: function (request, response) {
        var results = $.ui.autocomplete.filter(citiesNames, request.term);
        if (results.length > 10) {
            response(results.slice(0, 10));
        } else {
            response(results);
        }

    },
    delay: 400,
    select: function (event, ui) {
        // To be searched with ID for more precision
        var index = citiesNames.indexOf(ui.item.value);
        //console.log(cities[index].id);
    }
});

function stopRKey(evt) {
    var evt = (evt) ? evt : ((event) ? event : null);
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
    if ((evt.keyCode == 13) && (node.type == "text")) { return false; }
}

document.onkeypress = stopRKey; 