
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // to find company -> 
            console.log('data for /company: ', response.data)
            res.render('index', { company: response.data }); // company.name
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/capsules', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('list')
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/list', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('list');
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});
app.get('/single', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('single');
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

app.get('/search', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('search');
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});
app.get('/changelog', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('changelog');
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});
app.get('/index', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
        .then(function (response) {
            // handle success
            //   console.log(response.data);
            // res.json({ data: response.data });
            // return res.render('capsules', { capsules: response.data })
            return res.render('index');
        })
        .catch(function (error) {
            // console.log(error);
            res.json({ message: 'Data not found. Please try again later.' });
        });
});

// Scenario 1 - Return a single capsule
// app.get('/capsules/:serial', function (req, res) {
//     axios.get('https://api.spacexdata.com/v4/capsules')
//         .then(function (response) {
//             // handle success
//             // console.log(response.data);
//             // 
//             for (let i = 0; i < response.data.length; i++) {
//                 let capsule = response.data[i];
//                 let splitSerial = req.params.serial.split(''); // array ['c', '1', ...]
//                 let finalSerial = splitSerial[0].toUpperCase() + splitSerial.slice(1).join('');
//                 // upperCaseSerial[0].toUpperCase()
//                 // upperCaseSerial.join('');
//                 console.log('UpperCase Serial', finalSerial);
//                 // console.log('capsule', capsule); // { serial: 'C101', ...}
//                 if (capsule.serial === finalSerial) {
//                     return res.json({ capsule: capsule });
//                 }
//             }
//             return res.json({ message: 'Capsule does not exist' });
//         })
//         .catch(function (error) {
//             // console.log(error);
//             return res.json({ message: 'Data not found. Please try again later.' });
//         });
// });

app.get('/capsules/*', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/capsules')
    .then(function (response) {
        // print req.params
        console.log('req.params', req.params); // print an object
        console.log('api response', response.data); // print an array of capsules
        // run a for loop to search based of the key from req.params
        const capsuleArray = [];
        for (let i = 0; i < response.data.length; i++) {
            let capsule = response.data[i];
            let userRequest = req.params['0'].split('/'); // ['serial', 'c103'] ['reuse_count', '0'] parsing -> getting it into the format the will serve us...
            if (req.params['0'].includes('serial')) {
                if (capsule.serial === userRequest[1].toUpperCase()) {
                    return res.json({ capsule });
                }
            } else if (userRequest[0] === 'id') {
                if (capsule.id === userRequest[1]) {
                    return res.json({ capsule });
                }
            } else if (userRequest[0] === 'reuse_count') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let countValue = parseInt(userRequest[1]); // Number(userRequest[1])
                // check the count value
                if (capsule.reuse_count === countValue) {
                    capsuleArray.push(capsule);
                }
            } else if (userRequest[0] === 'water_landings') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let countValue = parseInt(userRequest[1]); // Number(userRequest[1])
                // check the count value
                if (capsule.water_landings === countValue) {
                    capsuleArray.push(capsule);
                }
            } else if (userRequest[0] === 'land_landings') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let countValue = parseInt(userRequest[1]); // Number(userRequest[1])
                // check the count value
                if (capsule.land_landings === countValue) {
                    capsuleArray.push(capsule);
                }
            } else if (userRequest[0] === 'last_update') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let countValue = parseInt(userRequest[1]); // Number(userRequest[1])
                // check the count value
                if (capsule.last_update === countValue) {
                    capsuleArray.push(capsule);
                }
            } else if (userRequest[0] === 'status') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let value = userRequest[1]; // Number(userRequest[1])
                // check the count value
                if (capsule.status === value) {
                    capsuleArray.push(capsule);
                }
            } else if (userRequest[0] === 'type') {
                // check to see which capsule have the reuse count
                // question: is the value of reuse_count a string or number when it comes in
                // from the user...
                let value = userRequest[1]; // Number(userRequest[1])
                // check the count value
                if (capsule.type === value) {
                    capsuleArray.push(capsule);
                }
            } else {
                return res.json({ message: 'Data is not found... Please try again.' });
            }

            // @todo - we need make a conditional for id
            // @todo - we need make a conditional for water_landings
            // @todo - we need make a conditional for last_update
            // @todo - we need make a conditional for status
            // @todo - we need make a conditional for type

        }
        return res.json({ capsules: capsuleArray });
    })
});


app.get('/company', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/company')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ data: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/cores', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/cores')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ data: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});


app.get('/dragons', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/dragons')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ dragons: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/landpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/landpads')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ landpads: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/launches', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launches')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ launches: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/launchpads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/launchpads')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ launchpads: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/payloads', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ payloads: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/rockets', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/rockets')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ rockets: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});


app.get("/search", (req, res) => {
    let result = {};
    // { name: 'capsules', serial: 'C103' }
    // How would we make an axios when the name is different?
    axios.get(`https://api.spacexdata.com/v4/${req.query.item}`)
    .then(function(response) {
        for (let key in req.query) {
            if (key === 'item') {
                // do nothing
                continue;
            } else {
                // run for loop to search for key and value
                // key -> serial
                // req.query[key] -> C103
                for (let i = 0; i < response.data.length; i++) {
                    let capsule = response.data[i];
                    if (capsule.serial === req.query[key]) { // if the response capsule.serial is equal the search item C103
                        return res.json({ capsule });
                    }
                }
            }
        }
        return res.json({ message: 'Data not found. Please try again...' })
    })
    .catch(function (error) {
        // console.log(error);
        return res.json({ message: 'Data not found. Please try again later.' });
    });
});

app.get('/payloads/:serial', function (req, res) {
    axios.get('https://api.spacexdata.com/v4/payloads')
    .then(function (response) {
        // handle success
        //   console.log(response.data);
        res.json({ payloads: response.data });
    })
    .catch(function (error) {
        // console.log(error);
        res.json({ message: 'Data not found. Please try again later.' });
    });
});


app.get('*', function (req, res) {

    console.log('REQ.PARAMS ->', req.params);

    res.json({ message: `There is no data for /${ req.params.input }` });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
    console.log(`Server is running on PORT`, PORT);
});