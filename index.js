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

// Return a single capsule
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
                res.json({ data: 'Capsule does not exist.' });
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
                response.data.forEach((capsule) => {
                    if(capsule.serial.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/capsules/${capsule.id}`);
                    }
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                response.data.forEach((capsule) => {
                    if(capsule.id.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/capsules/${capsule.id}`);
                    }
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
                res.render('capsules', { message: '', capsules: capsuleArray, searchBy, searchVal });
            } else {
                return res.render('capsules', { message: 'No matching capsules.', capsules: capsuleArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return Capsules by Parameter
// app.get('/capsules/*', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/capsules')
//         .then(function (response) {

//             // run a for loop to search based on the key from req.params
//             const capsuleArray = [];
//             for (let i in response.data) {
//                 let capsule = response.data[i];
//                 let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
//                 if(userRequest[0].toLowerCase() === 'serial') { // search by serial
//                     if(capsule.serial.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ capsule });
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'id') { // search by id
//                     if(capsule.id.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ capsule });
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'reuse_count') { // search by reuse_count
//                     let countValue = parseInt(userRequest[1]);
//                     if (capsule.reuse_count === countValue) {
//                         capsuleArray.push(capsule);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'water_landings') { // search by water_landings
//                     let countValue = parseInt(userRequest[1]);
//                     if (capsule.water_landings === countValue) {
//                         capsuleArray.push(capsule);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'last_update') { // search by last_update
//                     if (capsule.last_update === userRequest[1]) {
//                         capsuleArray.push(capsule);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'status') { // search by status
//                     if (capsule.status === userRequest[1]) {
//                         capsuleArray.push(capsule);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'type') { // search by type
//                     if (capsule.type === userRequest[1]) {
//                         capsuleArray.push(capsule);
//                     }
//                 } else {
//                     return res.json({ message: 'Invalid key.' });
//                 }
//             }
            
//             if (capsuleArray.length > 0) {
//                 return res.json({ capsules: capsuleArray });
//             } else {
//                 return res.json({ message: 'No matching capsules.' });
//             }
//         });
// });

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

// Return a single core by Serial
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
                res.json({ data: 'Core does not exist.' });
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
                response.data.forEach((core) => {
                    if(core.serial.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/cores/${core.id}`);
                    }
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                response.data.forEach((core) => {
                    if(core.id.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/cores/${core.id}`);
                    }
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
                res.render('cores', { message: '', cores: coreArray, searchBy, searchVal });
            } else {
                return res.render('cores', { message: 'No matching cores.', cores: coreArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return cores by Parameter
// app.get('/cores/*', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/cores')
//         .then(function (response) {

//             // run a for loop to search based on the key from req.params
//             const coreArray = [];
//             for (let i in response.data) {
//                 let core = response.data[i];
//                 let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
//                 if(userRequest[0].toLowerCase() === 'serial') { // search by serial
//                     if(core.serial.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ core });
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'last_update') { // search by last_update
//                     if(core.last_update === userRequest[1]) {
//                         coreArray.push(core);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'reuse_count') { // search by reuse_count
//                     let countValue = parseInt(userRequest[1]);
//                     if (core.reuse_count === countValue) {
//                         coreArray.push(core);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'rtls_landings') { // search by rtls_landings
//                     let countValue = parseInt(userRequest[1]);
//                     if (core.rtls_landings === countValue) {
//                         coreArray.push(core);
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'status') { // search by status
//                     if(core.status === userRequest[1]) {
//                         coreArray.push(core);
//                     }
//                 } else {
//                     return res.json({ message: 'Invalid key.' });
//                 }
//             }
            
//             if (coreArray.length > 0) {
//                 return res.json({ cores: coreArray });
//             } else {
//                 return res.json({ message: 'No matching cores.' });
//             }
//         });
// });

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
            res.json({ data: 'Crew member does not exist.' });
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
                response.data.forEach((crew) => {
                    if (crew.name.toUpperCase() === searchVal.toUpperCase()) {
                        let firstName = crew.name.split(' ')[0];
                        let lastName = crew.name.split(' ')[1];
                        return res.redirect(`/crew/${firstName}/${lastName}`);
                    }
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                response.data.forEach((crew) => {
                    if (crew.id.toUpperCase() === searchVal.toUpperCase()) {
                        let firstName = crew.name.split(' ')[0];
                        let lastName = crew.name.split(' ')[1];
                        return res.redirect(`/crew/${firstName}/${lastName}`);
                    }
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
                res.render('crew', { message: '', crew: crewArray, searchBy, searchVal });
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
                return res.json({ data: 'Dragon does not exist.' });
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
                response.data.forEach((dragon) => {
                    if (dragon.name.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/dragons/${dragon.id}`);
                    }
                });
            } else if(searchBy.toLowerCase() === 'id') { // search by id
                response.data.forEach((dragon) => {
                    if (dragon.id.toUpperCase() === searchVal.toUpperCase()) {
                        return res.redirect(`/dragons/${dragon.id}`);
                    }
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
                res.render('dragons', { message: '', dragons: dragonArray, searchBy, searchVal });
            } else {
                return res.render('dragons', { message: 'No matching dragon.', dragons: dragonArray, searchBy, searchVal });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return dragons by Parameter
// app.get('/dragons/*', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/dragons')
//         .then(function (response) {

//             // run a for loop to search based on the key from req.params
//             const dragonArray = [];
//             for (let i in response.data) {
//                 let dragon = response.data[i];
//                 let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
//                 if(userRequest[0].toLowerCase() === 'name') { // search by name
//                     if(dragon.name.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ dragon });
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'id') { // search by id
//                     if(dragon.id.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ dragon });
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'crew_capacity') { // search by crew_capacity
//                     let crewCap = parseInt(userRequest[1]);
//                     if (dragon.crew_capacity === crewCap) {
//                         dragonArray.push(dragon);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'status') { // search by status
//                     if (dragon.status === userRequest[1]) {
//                         dragonArray.push(dragon);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'type') { // search by type
//                     if (dragon.type === userRequest[1]) {
//                         dragonArray.push(dragon);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'active') { // search by active
//                     if ((dragon.active === true && userRequest[1].toLowerCase() === 'true') || (dragon.active === false && userRequest[1].toLowerCase() === 'false')) {
//                         dragonArray.push(dragon);
//                     }
//                 } else {
//                     return res.json({ message: 'Invalid key.' });
//                 }
//             }
            
//             if (dragonArray.length > 0) {
//                 return res.json({ dragons: dragonArray });
//             } else {
//                 return res.json({ message: 'No matching dragons.' });
//             }
//         });
// });

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
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
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
                    res.json({ data: response.data[i] });
                    found = true;
                }
            }
            if (!found) {
                res.json({ data: 'Landpad does not exist.' });
            }
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return landpads by Parameter
// app.get('/landpads/*', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/landpads')
//         .then(function (response) {

//             // run a for loop to search based on the key from req.params
//             const landpadArray = [];
//             for (let i in response.data) {
//                 let landpad = response.data[i];
//                 let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
//                 if(userRequest[0].toLowerCase() === 'full_name') { // search by full_name
//                     if(landpad.full_name.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ landpad });
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'id') { // search by id
//                     if(landpad.id.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ landpad });
//                     }
//                 } else if(userRequest[0].toLowerCase() === 'region') { // search by region
//                     if(landpad.region.toUpperCase() === userRequest[1].toUpperCase()) {
//                         return res.json({ landpad });
//                     }
//                 }else if (userRequest[0].toLowerCase() === 'landing_attempts') { // search by landing_attempts
//                     let landAttempts = parseInt(userRequest[1]);
//                     if (landpad.landing_attempts === landAttempts) {
//                         landpadArray.push(landpad);
//                     }
//                 } else if (userRequest[0].toLowerCase() === 'type') { // search by type
//                     if (landpad.type === userRequest[1]) {
//                         landpadArray.push(landpad);
//                     }
//                 } else {
//                     return res.json({ message: 'Invalid key.' });
//                 }
//             }
            
//             if (landpadArray.length > 0) {
//                 return res.json({ landpads: landpadArray });
//             } else {
//                 return res.json({ message: 'No matching landpads.' });
//             }
//         });
// });

app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v5/launches')
        .then(function (response) {
            // handle success
            res.json({ data: response.data });
        })
        .catch(function (error) {
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Return a single launch by ID
// app.get('/launches/:id', function (req, res) {
//     axios.get('https://api.spacexdata.com/v5/launches')
//         .then(function (response) {
//             // handle success
//             let found = false;

//             for (let i in response.data) {
//                 let launch = response.data[i];

//                 if (launch.id === req.params.id) {
//                     res.json({ data: response.data[i] });
//                     found = true;
//                 }
//             }
//             if (!found) {
//                 res.json({ data: 'Launch does not exist.' });
//             }
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

// Return launches by Parameter
app.get('/launches/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
        .then(function (response) {

            // run a for loop to search based on the key from req.params
            const launchArray = [];
            for (let i in response.data) {
                let launch = response.data[i];
                let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
                if(userRequest[0].toLowerCase() === 'name') { // search by name
                    if(launch.name.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if(userRequest[0].toLowerCase() === 'id') { // search by id
                    if(launch.id.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if(userRequest[0].toLowerCase() === 'region') { // search by region
                    if(launch.region.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launch });
                    }
                } else if (userRequest[0].toLowerCase() === 'flight_number') { // search by flight_number
                    let flightNumber = parseInt(userRequest[1]);
                    if (launch.flight_number === flightNumber) {
                        launchArray.push(launch);
                    }
                } else if (userRequest[0].toLowerCase() === 'success') { // search by success
                    if ((launch.success === true && userRequest[1].toLowerCase() === 'true') || (launch.success === false && userRequest[1].toLowerCase() === 'false')) {
                        launchArray.push(launch);
                    }
                } else {
                    return res.json({ message: 'Invalid key.' });
                }
            }
            
            if (launchArray.length > 0) {
                return res.json({ launches: launchArray });
            } else {
                return res.json({ message: 'No matching launches.' });
            }
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
// app.get('/launchpads/:id', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/launchpads')
//         .then(function (response) {
//             // handle success
//             let found = false;

//             for (let i in response.data) {
//                 let launchpad = response.data[i];

//                 if (launchpad.id === req.params.id) {
//                     res.json({ data: response.data[i] });
//                     found = true;
//                 }
//             }
//             if (!found) {
//                 res.json({ data: 'Launchpad does not exist.' });
//             }
//         })
//         .catch(function (error) {
//             res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

// Return launchpads by Parameter
app.get('/launchpads/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
        .then(function (response) {

            // run a for loop to search based on the key from req.params
            const launchpadArray = [];
            for (let i in response.data) {
                let launchpad = response.data[i];
                let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0']
                
                if(userRequest[0].toLowerCase() === 'full_name') { // search by full_name
                    if(launchpad.full_name.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launchpad });
                    }
                } else if(userRequest[0].toLowerCase() === 'id') { // search by id
                    if(launchpad.id.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launchpad });
                    }
                } else if(userRequest[0].toLowerCase() === 'region') { // search by region
                    if(launchpad.region.toUpperCase() === userRequest[1].toUpperCase()) {
                        return res.json({ launchpad });
                    }
                }else if (userRequest[0].toLowerCase() === 'launch_attempts') { // search by launch_attempts
                    let launchAttempts = parseInt(userRequest[1]);
                    if (launchpad.launch_attempts === launchAttempts) {
                        launchpadArray.push(launchpad);
                    }
                } else if (userRequest[0].toLowerCase() === 'status') { // search by status
                    if (launchpad.status.toUpperCase() === userRequest[1].toUpperCase()) {
                        launchpadArray.push(launchpad);
                    }
                } else {
                    return res.json({ message: 'Invalid key.' });
                }
            }
            
            if (launchpadArray.length > 0) {
                return res.json({ launchpads: launchpadArray });
            } else {
                return res.json({ message: 'No matching launchpads.' });
            }
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
            res.json({ data: response.data });
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

// Return a rocket by Name
app.get('/rockets/:name', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let rocket = response.data[i];

                if (rocket.name === req.params.name) {
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

// Return a ship by Name
app.get('/ships/:name', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/ships')
        .then(function (response) {
            // handle success
            let found = false;

            for (let i in response.data) {
                let ship = response.data[i];

                if (ship.name === req.params.name) {
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

// Return a single payload by ID
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