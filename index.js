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
                    return launch.flight_number === countValue;
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
            return res.render('launchpads', { launchpads: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/launchpads/search', function (req, res) {
    return res.render('launchpads/search');
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
                    return res.render('single-launchpad', { launchpad: response.data[i], launchpads: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.json({ data: 'Launchpad does not exist.' });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/launchpads/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let launchpadArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'full_name') { // search by full_name
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.full_name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'description') { // search by description
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.description && launchpad.description.toUpperCase().trim() === searchVal.toUpperCase().trim();
                });
            } else if (searchBy.toLowerCase() === 'status') { // search by status
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.status.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'locality') { // search by locality
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.locality.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'region') { // search by region
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.region.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'timezone') { // search by timezone
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.timezone.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'launch_attempts') { // search by launch_attempts
                let countValue = parseInt(searchVal);
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.launch_attempts === countValue;
                });
            } else if (searchBy.toLowerCase() === 'launch_successes') { // search by launch_successes
                let countValue = parseInt(searchVal);
                launchpadArray = response.data.filter((launchpad) => {
                    return launchpad.launch_successes === countValue;
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                launchpadArray = response.data.filter((launchpad) => {
                    let found = false;
                    launchpad.launches.forEach((launch) => {
                        if (launch.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'rocket') { // search by rocket
                launchpadArray = response.data.filter((launchpad) => {
                    let found = false;
                    launchpad.rockets.forEach((rocket) => {
                        if (rocket.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else {
                return res.render('launchpads', { launchpads: launchpadArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (launchpadArray.length > 0) {
                if (launchpadArray.length === 1) {
                    return res.redirect(`/launchpads/${launchpadArray[0].id}`);
                } else {
                    return res.render('launchpads', { message: '', launchpads: launchpadArray, searchBy, searchVal });
                }
            } else {
                return res.render('launchpads', { message: 'No matching launchpad.', launchpads: launchpadArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {
            // handle success
            return res.render('payloads', { payloads: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/payloads/search', function (req, res) {
    return res.render('payloads/search');
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
                    return res.render('single-payload', { payload: response.data[i], payloads: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.json({ data: 'Payload does not exist.' });
            }
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.post('/payloads/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let payloadArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                payloadArray = response.data.filter((payload) => {
                    return payload.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                payloadArray = response.data.filter((payload) => {
                    return payload.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'type') { // search by type
                payloadArray = response.data.filter((payload) => {
                    return payload.type.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'customer') { // search by customer
                payloadArray = response.data.filter((payload) => {
                    let found = false;
                    payload.customers.forEach((cust) => {
                        if (cust.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'manufacturer') { // search by manufacturer
                payloadArray = response.data.filter((payload) => {
                    let found = false;
                    payload.manufacturers.forEach((man) => {
                        if (man.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'nationality') { // search by nationality
                payloadArray = response.data.filter((payload) => {
                    let found = false;
                    payload.nationalities.forEach((nat) => {
                        if (nat.toUpperCase() === searchVal.toUpperCase()) {
                            found = true;
                        }
                    });
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'norad_id') { // search by norad_id
                searchVal = parseInt(searchVal);
                payloadArray = response.data.filter((payload) => {
                    let found = false;
                    if (payload.norad_ids.length) {
                        payload.norad_ids.forEach((id) => {
                            if (id === searchVal) {
                                found = true;
                            }
                        });
                    }
                    return found;
                });
            } else if (searchBy.toLowerCase() === 'capsule') { // search by capsule
                payloadArray = response.data.filter((payload) => {
                    return payload.dragon.capsule && payload.dragon.capsule.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'reused') { // search by reused
                payloadArray = response.data.filter((payload) => {
                    return ((payload.reused === true && searchVal.toUpperCase() === 'TRUE') || (payload.reused === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'launch') { // search by launch
                payloadArray = response.data.filter((payload) => {
                    return payload.launch && payload.launch.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'orbit') { // search by orbit
                payloadArray = response.data.filter((payload) => {
                    return payload.orbit && payload.orbit.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'reference_system') { // search by reference_system
                payloadArray = response.data.filter((payload) => {
                    return payload.reference_system && payload.reference_system.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'regime') { // search by regime
                payloadArray = response.data.filter((payload) => {
                    return payload.regime && payload.regime.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'lifespan') { // search by lifespan
                searchVal = parseInt(searchVal);
                payloadArray = response.data.filter((payload) => {
                    return payload.lifespan_years === searchVal;
                });
            } else {
                return res.render('payloads', { payloads: payloadArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (payloadArray.length > 0) {
                if (payloadArray.length === 1) {
                    return res.redirect(`/payloads/${payloadArray[0].id}`);
                } else {
                    return res.render('payloads', { message: '', payloads: payloadArray, searchBy, searchVal });
                }
            } else {
                return res.render('payloads', { message: 'No matching payload.', payloads: payloadArray, searchBy, searchVal });
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
            return res.render('rockets', { rockets: response.data });
        })
        .catch(function (error) {
            return res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/rockets/search', function (req, res) {
    return res.render('rockets/search');
});

app.post('/rockets/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {

            let searchBy = req.body.category;
            let searchVal = req.body.item;
            let rocketArray = [];

            if(searchBy.toLowerCase() === 'name') { // search by name
                rocketArray = response.data.filter((rocket) => {
                    return rocket.name.toUpperCase() === searchVal.toUpperCase();
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                rocketArray = response.data.filter((rocket) => {
                    return rocket.id.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'description') { // search by description
                rocketArray = response.data.filter((rocket) => {
                    return rocket.description.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'active') { // search by active
                rocketArray = response.data.filter((rocket) => {
                    return ((rocket.active === true && searchVal.toUpperCase() === 'TRUE') || (rocket.active === false && searchVal.toUpperCase() === 'FALSE'));
                });
            } else if (searchBy.toLowerCase() === 'type') { // search by type
                rocketArray = response.data.filter((rocket) => {
                    return rocket.type.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'stages') { // search by stages
                searchVal = parseInt(searchVal);
                rocketArray = response.data.filter((rocket) => {
                    return rocket.stages === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'boosters') { // search by boosters
                searchVal = parseInt(searchVal);
                rocketArray = response.data.filter((rocket) => {
                    return rocket.boosters === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'cost_per_launch') { // search by cost_per_launch
                searchVal = parseInt(searchVal);
                rocketArray = response.data.filter((rocket) => {
                    return rocket.cost_per_launch === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'success_rate_pct') { // search by success_rate_pct
                searchVal = parseInt(searchVal);
                rocketArray = response.data.filter((rocket) => {
                    return rocket.success_rate_pct === searchVal;
                });
            } else if (searchBy.toLowerCase() === 'first_flight') { // search by first_flight
                rocketArray = response.data.filter((rocket) => {
                    return rocket.first_flight && rocket.first_flight.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'country') { // search by country
                rocketArray = response.data.filter((rocket) => {
                    return rocket.country && rocket.country.toUpperCase() === searchVal.toUpperCase();
                });
            } else if (searchBy.toLowerCase() === 'company') { // search by company
                rocketArray = response.data.filter((rocket) => {
                    return rocket.company && rocket.company.toUpperCase() === searchVal.toUpperCase();
                });
            } else {
                return res.render('rockets', { rockets: rocketArray, message: 'Invalid key.', searchBy, searchVal });
            }
            

            if (rocketArray.length > 0) {
                if (rocketArray.length === 1) {
                    return res.redirect(`/rockets/${rocketArray[0].id}`);
                } else {
                    return res.render('rockets', { message: '', rockets: rocketArray, searchBy, searchVal });
                }
            } else {
                return res.render('rockets', { message: 'No matching rocket.', rockets: rocketArray, searchBy, searchVal });
            }
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
                    return res.render('single-rocket', { rocket: response.data[i], rockets: response.data });
                    found = true;
                }
            }
            if (!found) {
                return res.render('rockets', { data: 'Rocket does not exist.' });
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