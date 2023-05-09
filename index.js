const express = require('express');
const axios = require('axios');
const app = express();
const ejsLayouts = require('express-ejs-layouts');


app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
    .then(function (response) {
        // handle success
        return res.render('index', { company: response.data });
    })
    .catch(function (error) {
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/about', function (req, res) {
    res.sendFile(__dirname+'/views/about.html');
});

app.get('/blog', function (req, res) {
    res.sendFile(__dirname+'/views/blog-directory.html');
});

app.get('/changelog', function (req, res) {
    return res.render('changelog');
});

app.get('/contact', function (req, res) {
    return res.render('contact');
});

app.get('/list', function (req, res) {
    return res.render('list');
});

app.get('/index', function (req, res) {
    return res.render('index');
});

app.get('/search', function (req, res) {
    return res.render('search');
});

app.get('/single', function (req, res) {
    return res.render('single');
});

app.get('/capsules', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            return res.render('capsules', { capsules: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/capsules/search', function (req, res) {
    return res.render('capsules/search', )
});

// Return a single capsule by ID
app.get('/capsules/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let capsule = response.data[i];

                if (capsule.id === req.params.id) {
                    found = true;
                    return res.render('single-capsule', { capsules: response.data, capsule: response.data[i] });
                }
            }
            if (!found) {
                res.render('capsules', { message: 'Capsule does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/capsules/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let capsuleArray = [];

            if(searchBy.toLowerCase() === 'serial') { // search by serial
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.serial.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'reuse_count') { // search by reuse_count
                let countValue = parseInt(searchVal);
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.reuse_count === countValue;
                });
            } else if (searchBy.toLowerCase() === 'water_landings') { // search by water_landings
                let countValue = parseInt(searchVal);
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.water_landings === countValue;
                });
            } else if (searchBy.toLowerCase() === 'land_landings') { // search by land_landings
                let countValue = parseInt(searchVal);
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.land_landings === countValue;
                });
            } else if (searchBy.toLowerCase() === 'last_update') { // search by last_update
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.last_update && capsule.last_update.trim() === searchVal.trim();
                });
            } else if (searchBy.toLowerCase() === 'status') { // search by status
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.status.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'type') { // search by type
                capsuleArray = response.data.filter((capsule) => {
                    return capsule.type.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                capsuleArray = response.data.filter((capsule) => {
                    let found = false;
                    capsule.launches.forEach((launch) => {
                        if (launch.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('capsules', { capsules: capsuleArray, message: 'Invalid key.', searchBy, searchVal });
            }
            
            if (capsuleArray.length > 0) {
                if (capsuleArray.length === 1) {
                    res.redirect(`/capsules/${capsuleArray[0].id}`);
                } else {
                    res.render('capsules', { message: '', capsules: capsuleArray, searchBy, searchVal });
                }
            } else {
                return res.render('capsules', { message: 'No matching capsules.', capsules: capsuleArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/company', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            res.render('company', { company: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/cores', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            return res.render('cores', { cores: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/cores/search', function (req, res) {
    return res.render('cores/search');
});

// Return a single core by ID
app.get('/cores/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let core = response.data[i];

                if (core.id.toUpperCase() === req.params.id.toUpperCase()) {
                    res.render('single-core', { core: response.data[i], cores: response.data });
                    found = true;
                }
            }
            if (!found) {
                res.render('cores', { message: 'Core does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/cores/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let coreArray = [];

            if(searchBy.toLowerCase() === 'serial') { // search by serial
                coreArray = response.data.filter((core) => {
                    return core.serial.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                coreArray = response.data.filter((core) => {
                    return core.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'block') { // search by block
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.block === countValue;
                });
            } else if (searchBy.toLowerCase() === 'reuse_count') { // search by reuse_count
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.reuse_count === countValue;
                });
            } else if (searchBy.toLowerCase() === 'rtls_attempts') { // search by rtls_attempts
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.rtls_attempts === countValue;
                });
            } else if (searchBy.toLowerCase() === 'rtls_landings') { // search by rtls_landings
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.rtls_landings === countValue;
                });
            } else if (searchBy.toLowerCase() === 'asds_attempts') { // search by asds_attempts
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.asds_attempts === countValue;
                });
            } else if (searchBy.toLowerCase() === 'asds_landings') { // search by asds_landings
                let countValue = parseInt(searchVal);
                coreArray = response.data.filter((core) => {
                    return core.asds_landings === countValue;
                });
            } else if (searchBy.toLowerCase() === 'last_update') { // search by last_update
                coreArray = response.data.filter((core) => {
                    return core.last_update && core.last_update.trim() === searchVal.trim();
                });
            } else if (searchBy.toLowerCase() === 'status') { // search by status
                coreArray = response.data.filter((core) => {
                    return core.status.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                coreArray = response.data.filter((core) => {
                    let found = false;
                    core.launches.forEach((launch) => {
                        if (launch.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('cores', { cores: coreArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (coreArray.length > 0) {
                if (coreArray.length === 1) {
                    return res.redirect(`/cores/${coreArray[0].id}`);
                } else {
                    return res.render('cores', { message: '', cores: coreArray, searchBy, searchVal });
                }
            } else {
                return res.render('cores', { message: 'No matching cores.', cores: coreArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/crew', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
    .then(function (response) {
        // handle success
        res.render('crew', { crew: response.data });
    })
    .catch(function (error) {
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/crew/search', function (req, res) {
    return res.render('crew/search');
});
    
// Return a crew member by Name
app.get('/crew/:firstname/:lastname', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
    .then(function (response) {
        // handle success
        let found = false;

        for (let i in response.data) {
            let crewmem = response.data[i];
            let firstName = crewmem.name.split(' ')[0];
            let lastName = crewmem.name.split(' ')[1];

            if (firstName === req.params.firstname && lastName === req.params.lastname) {
                return res.render('single-crew', { crew: response.data, member: crewmem });
                found = true;
            }
        }
        if (!found) {
            res.json('crew', { message: 'Crew member does not exist.' });
        }
    })
    .catch(function (error) {
        res.json({ message: 'Data not found. Please try again later.' });
    });
});


app.post('/crew/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/crew')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let crewArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                crewArray = response.data.filter((crew) => {
                    return crew.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                crewArray = response.data.filter((crew) => {
                    return crew.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'agency') { // search by agency
                crewArray = response.data.filter((crew) => {
                    return crew.agency.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'status') { // search by status
                crewArray = response.data.filter((crew) => {
                    return crew.status.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                crewArray = response.data.filter((crew) => {
                    let found = false;
                    crew.launches.forEach((launch) => {
                        if (launch.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('crew', { crew: crewArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (crewArray.length > 0) {
                if (crewArray.length === 1) {
                    let firstName = crewArray[0].name.split(' ')[0];
                    let lastName = crewArray[0].name.split(' ')[1];
                    return res.redirect(`/crew/${firstName}/${lastName}`);
                } else {
                    res.render('crew', { message: '', crew: crewArray, searchBy, searchVal });
                }
            } else {
                return res.render('crew', { message: 'No matching crew.', crew: crewArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            return res.render('dragons', { dragons: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/dragons/search', function (req, res) {
    return res.render('dragons/search');
});

// Return a single dragon by ID
app.get('/dragons/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let dragon = response.data[i];

                if (dragon.id === req.params.id) {
                    return res.render('single-dragon', { dragon: response.data[i], dragons: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.render('dragons', { message: 'Dragon does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});


app.post('/dragons/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let dragonArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                dragonArray = response.data.filter((dragon) => {
                    return dragon.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                dragonArray = response.data.filter((dragon) => {
                    return dragon.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'type') { // search by type
                dragonArray = response.data.filter((dragon) => {
                    return dragon.type.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'active') { // search by active
                dragonArray = response.data.filter((dragon) => {
                    return dragon.active === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'first_flight') { // search by first_flight
                dragonArray = response.data.filter((dragon) => {
                    return dragon.first_flight === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'crew_capacity') { // search by crew_capacity
                dragonArray = response.data.filter((dragon) => {
                    return dragon.crew_capacity.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'orbit_duration_yr') { // search by orbit_duration_yr
                dragonArray = response.data.filter((dragon) => {
                    return dragon.orbit_duration_yr.toUpperCase() === searchVal.toUpperCase();
                });
            } else {
                return res.render('dragons', { dragons: dragonArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (dragonArray.length > 0) {
                if (dragonArray.length === 1) {
                    return res.redirect(`/dragons/${dragonArray[0].id}`);
                } else {
                    return res.render('dragons', { message: '', dragons: dragonArray, searchBy, searchVal });
                }
            } else {
                return res.render('dragons', { message: 'No matching dragon.', dragons: dragonArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/history', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/history')
        .then(function (response) {
            // handle success
            res.render('history', { history: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            res.render('landpads', { landpads: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/landpads/search', function (req, res) {
    return res.render('landpads/search');
});

// Return a single landpad by ID
app.get('/landpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let landpad = response.data[i];

                if (landpad.id === req.params.id) {
                    return res.render('single-landpad', { landpad: response.data[i], landpads: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.render('landpads', { message: 'Landpad does not exist.' });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/landpads/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let landpadArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                landpadArray = response.data.filter((landpad) => {
                    return landpad.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'full_name') { // search by full_name
                landpadArray = response.data.filter((landpad) => {
                    return landpad.full_name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                landpadArray = response.data.filter((landpad) => {
                    return landpad.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'description') { // search by description
                landpadArray = response.data.filter((landpad) => {
                    return landpad.description && landpad.description.toUpperCase().trim() === searchVal.toUpperCase().trim();
                });
            } else if (searchBy.toLowerCase() === 'type') { // search by type
                landpadArray = response.data.filter((landpad) => {
                    return landpad.type.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'status') { // search by status
                landpadArray = response.data.filter((landpad) => {
                    return landpad.status.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'locality') { // search by locality
                landpadArray = response.data.filter((landpad) => {
                    return landpad.locality.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'landing_attempts') { // search by landing_attempts
                let countValue = parseInt(searchVal);
                landpadArray = response.data.filter((landpad) => {
                    return landpad.landing_attempts === countValue;
                });
            } else if (searchBy.toLowerCase() === 'landing_successes') { // search by landing_successes
                let countValue = parseInt(searchVal);
                landpadArray = response.data.filter((landpad) => {
                    return landpad.landing_successes === countValue;
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                landpadArray = response.data.filter((landpad) => {
                    let found = false;
                    landpad.launches.forEach((launch) => {
                        if (launch.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('landpads', { landpads: landpadArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (landpadArray.length > 0) {
                if (landpadArray.length === 1) {
                    return res.redirect(`/landpads/${landpadArray[0].id}`);
                } else {
                    return res.render('landpads', { message: '', landpads: landpadArray, searchBy, searchVal });
                }
            } else {
                return res.render('landpads', { message: 'No matching landpad.', landpads: landpadArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v5/launches')
        .then(function (response) {
            // handle success
            return res.render('launches', { launches: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/launches/search', function (req, res) {
    return res.render('launches/search');
});


// Return a single launch by ID
app.get('/launches/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v5/launches')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let launch = response.data[i];

                if (launch.id === req.params.id) {
                    return res.render('single-launch', { launch: response.data[i], launches: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.render('launches', { message: 'Launch does not exist.' });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/launches/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v5/launches')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let launchArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                launchArray = response.data.filter((launch) => {
                    return launch.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'flight_number') { // search by flight_number
                launchArray = response.data.filter((launch) => {
                    let countValue = parseInt(searchVal);
                    return launch.flight_number.toUpperCase() === countValue.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                launchArray = response.data.filter((launch) => {
                    return launch.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'details') { // search by details
                launchArray = response.data.filter((launch) => {
                    return launch.details && launch.details.toUpperCase().trim() === searchVal.toUpperCase().trim();
                });
            } else if (searchBy.toLowerCase() === 'upcoming') { // search by upcoming
                launchArray = response.data.filter((launch) => {
                    return ((launch.upcoming === true && searchVal.toUpperCase() === 'TRUE') || (launch.upcoming === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'tbd') { // search by tbd
                launchArray = response.data.filter((launch) => {
                    return ((launch.tbd === true && searchVal.toUpperCase() === 'TRUE') || (launch.tbd === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'success') { // search by success
                launchArray = response.data.filter((launch) => {
                    return ((launch.success === true && searchVal.toUpperCase() === 'TRUE') || (launch.success === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'net') { // search by net
                launchArray = response.data.filter((launch) => {
                    return ((launch.net === true && searchVal.toUpperCase() === 'TRUE') || (launch.net === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'date_utc') { // search by date
                launchArray = response.data.filter((launch) => {
                    return launch.date_utc.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'static_fire_date_utc') { // search by static_fire_date
                launchArray = response.data.filter((launch) => {
                    return launch.static_fire_date_utc && launch.static_fire_date_utc.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'rocket') { // search by rocket
                launchArray = response.data.filter((launch) => {
                    return launch.rocket.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'core') { // search by core
                launchArray = response.data.filter((launch) => {
                    let found = false;
                    launch.cores.forEach((c) => {
                        if (c.core && c.core.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'ship') { // search by ship
                launchArray = response.data.filter((launch) => {
                    let found = false;
                    launch.ships.forEach((ship) => {
                        if (ship.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'payload') { // search by payload
                launchArray = response.data.filter((launch) => {
                    let found = false;
                    launch.payloads.forEach((payload) => {
                        if (payload.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'capsule') { // search by capsule
                launchArray = response.data.filter((launch) => {
                    let found = false;
                    launch.capsules.forEach((capsule) => {
                        if (capsule.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'crew') { // search by crew
                launchArray = response.data.filter((launch) => {
                    let found = false;
                    launch.crew.forEach((mem) => {
                        if (typeof mem === 'object' && mem.crew === searchVal) {
                            found = true;
                        } else if (mem === searchVal) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('launches', { launches: launchArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (launchArray.length > 0) {
                if (launchArray.length === 1) {
                    res.redirect(`/launches/${launchArray[0].id}`);
                } else {
                    res.render('launches', { message: '', launches: launchArray, searchBy, searchVal });
                }
            } else {
                return res.render('launches', { message: 'No matching launch.', launches: launchArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single launchpad by ID
app.get('/launchpads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let launchpad = response.data[i];

                if (launchpad.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Launchpad does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single payload by ID
app.get('/payloads/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let payload = response.data[i];

                if (payload.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Payload does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/roadster', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/roadster')
        .then(function (response) {
            // handle success
            res.render('roadster', { roadster: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/rockets', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a rocket by ID
app.get('/rockets/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let rocket = response.data[i];

                if (rocket.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Rocket does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/ships', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a ship by ID
app.get('/ships/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let ship = response.data[i];

                if (ship.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Ship does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/starlink', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single starlink by ID
app.get('/starlink/:id', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/starlink')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let satellite = response.data[i];

                if (satellite.id === req.params.id) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Satellite does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/search', (req, res) => {
    // parse query string
    let item, searchBy, searchVal;
    
    for (let key in req.query) {
        switch (key) {
            case 'item':
                item = req.query[key];
                break;
            default:
                searchBy = key;
                searchVal = req.query[key];
                break;
        }
    }

    axios.get(`https://api.spacexdata.com/v4/${item}`)
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let loopItem = response.data[i];

                if (loopItem[searchBy] === searchVal) {
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ message: `No matching item found.` });
            }
        })
        .catch((error) => {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/:input', function (req, res) {
    res.json({ message: `There is no data for /${req.params.input}` });
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});

module.exports = {
    server,
    app,
    PORT,
    axios
};