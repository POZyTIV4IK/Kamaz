            const url = "http://192.168.1.10:5000";
            var map, infoWindow, marker;
            var dataFromServer;

            function fetchData() {
                fetch(url)
                        .then(response => response.text())
                        .then(contents => dataFromServer = contents)
                        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
                return dataFromServer;
            }

            function multiplyMatrixAndPoint(matrix, point) {

                //Give a simple variable name to each part of the matrix, a column and row number
                var c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
                var c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
                var c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
                var c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

                //Now set some simple names for the point
                var x = point[0];
                var y = point[1];
                var z = point[2];
                var w = point[3];

                //Multiply the point against each part of the 1st column, then add together
                var resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

                //Multiply the point against each part of the 2nd column, then add together
                var resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

                //Multiply the point against each part of the 3rd column, then add together
                var resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

                //Multiply the point against each part of the 4th column, then add together
                var resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

                return [resultX, resultY, resultZ, resultW];
            }


            function multiplyMatrices(matrixA, matrixB) {

                // Slice the second matrix up into columns
                var column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
                var column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
                var column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
                var column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];

                // Multiply each column by the matrix
                var result0 = multiplyMatrixAndPoint(matrixA, column0);
                var result1 = multiplyMatrixAndPoint(matrixA, column1);
                var result2 = multiplyMatrixAndPoint(matrixA, column2);
                var result3 = multiplyMatrixAndPoint(matrixA, column3);

                // Turn the result columns back into a single matrix
                return [
                    result0[0], result1[0], result2[0], result3[0],
                    result0[1], result1[1], result2[1], result3[1],
                    result0[2], result1[2], result2[2], result3[2],
                    result0[3], result1[3], result2[3], result3[3]
                ];
            }


            function renderMarker(position) {
                if (marker) {
                    fetchData();
                    var array = dataFromServer.split(" ");
                    var b = parseFloat(array[0]);
                    var c = parseFloat(array[1]);
                    var d = parseFloat(array[4]);
                    var e = -0.15708;

                    console.log(b);
                    console.log(c);

                    var trans = [
                        Math.cos(e), (-1) * Math.sin(e), 0, 0,
                        Math.sin(e), Math.cos(e), 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0
                    ];

                    var origin = [
                        b, 0, 0, 0,
                        c, 0, 0, 0,
                        0, 0, 0, 0,
                        0, 0, 0, 0
                    ];


                    var result = multiplyMatrices(trans, origin);

                    var f = 51.098891 - result[0];
                    var g = 71.399450 - result[4];


                    if(document.getElementById('radio-virtual').checked) {
                      marker.setPosition({lat: f, lng: g});
                    }
                    else if(document.getElementById('radio-real').checked) {
                      marker.setPosition({lat: position.coords.latitude, lng: position.coords.longitude});
                    }


                    marker.setIcon({path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
                        zoom: 10,
                        scale: 0.5,
                        anchor: new google.maps.Point(32, 32),
                        fillColor: 'red',
                        fillOpacity: 0.8,
                        strokeWeight: 2,
                        rotation: ((-d) * 180 / Math.PI) - 80
                    });
                } else {
                    var icon = {path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
                        zoom: 10,
                        scale: 0.5,
                        fillColor: 'red',
                        anchor: new google.maps.Point(32, 32),
                        fillOpacity: 0.8,
                        strokeWeight: 2,
                        rotation: ((-d) * 180 / Math.PI) - 80
                    };
                    var posoc = {lat: position.coords.latitude, lng: position.coords.latitude};
                    marker = new google.maps.Marker({
                        position: posoc,
                        map: map,
                        draggable: true,
                        icon: icon
                    });
                }
            }



            function initMap() {

                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: -34.397, lng: 150.644},
                    zoom: 15,
                    mapTypeId: 'satellite'
                });


                infoWindow = new google.maps.InfoWindow;


                  map.addListener('click', function (event) {
                    if(document.getElementById('radio-finish').checked) {
                     placeMarker(event.latLng);
                   }
                    else if(document.getElementById('radio-between').checked) {
                     placeMarker1(event.latLng);
                   }
                 });


                navigator.geolocation.watchPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    map.setCenter(pos);

                    setInterval(renderMarker, 1000, position);

                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            }


            var marker1;

            function Rotate() {
                var x = document.getElementById('rangeik').value;
                rotation = parseInt(x);
            }




            function placeMarker(location) {
                if (marker1) {

                    Rotate();

                    marker1.setPosition(location);

                    marker1.setIcon({path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
                        zoom: 10,
                        scale: 0.5,
                        anchor: new google.maps.Point(32, 32),
                        fillColor: 'white',
                        fillOpacity: 0.8,
                        strokeWeight: 2,
                        rotation: rotation
                    });


                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            document.getElementById("demo").innerHTML = this.responseText;
                        }
                    };
                    xhttp.open("POST", "http://10.1.199.229:5000/sendlocation", true);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    var data = JSON.stringify({"latitude": (marker1.getPosition().lat()), "longitude": (marker1.getPosition().lng())});
                    xhttp.send(data);


                    console.log(marker1.getPosition().lat());
                    console.log(marker1.getPosition().lng());
                } else {

                    Rotate();

                    var icon = {path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
                        zoom: 10,
                        scale: 0.5,
                        fillColor: 'white',
                        anchor: new google.maps.Point(32, 32),
                        fillOpacity: 0.8,
                        strokeWeight: 2,
                        rotation: rotation

                    };
                    marker1 = new google.maps.Marker({
                        position: location,
                        map: map,
                        draggable: true,
                        icon: icon
                    });



                    var xhttp = new XMLHttpRequest();
                    xhttp.onreadystatechange = function () {
                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            document.getElementById("demo").innerHTML = this.responseText;
                        }
                    };
                    xhttp.open("POST", "http://10.1.199.229:5000/sendlocation", true);
                    xhttp.setRequestHeader("Content-type", "application/json");
                    var data = JSON.stringify({"latitude": (marker1.getPosition().lat()), "longitude": (marker1.getPosition().lng())});
                    xhttp.send(data);

                    console.log(marker1.getPosition().lat());
                    console.log(marker1.getPosition().lng());
                    Markers.push(marker1);

                }

            }



          function placeMarker1(location) {
          marker2 = new google.maps.Marker({
              position: location,
              map: map,
              draggable: true
          });
        }




            function handleLocationError(browserHasGeolocation, infoWindow, pos) {
                infoWindow.setPosition(pos);
                infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
                infoWindow.open(map);
            }

            function start() {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        document.getElementById("demo").innerHTML = this.responseText;
                    }
                };
                xhttp.open("POST", "http://10.1.199.229:5000/startstop", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                var data = JSON.stringify({"Action": 1});
                xhttp.send(data);
            }
            function stop() {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        document.getElementById("demo").innerHTML = this.responseText;
                    }
                };
                xhttp.open("POST", "http://10.1.199.229:5000/startstop", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                var data = JSON.stringify({"Action": 0});
                xhttp.send(data);
            }
