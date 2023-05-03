const { app, server, PORT, axios } = require('../index');
const request = require('supertest');

describe('PORT', () => {
    it('PORT is a number', () => {
        expect(typeof PORT).toBe('number');
    });

    it('PORT is 8000 on development', () => {
        expect(PORT).toBe(8000);
    });
});

describe('GET /', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /capsules', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/capsules')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/capsules')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /capsules/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/capsules/serial/C103')
            .then((response) => {
                let serialValue = response.data.capsule.serial;
                expect(Boolean(serialValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus capsule serial', () => {
        return axios.get('http://localhost:8000/capsules/serial/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching capsules.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /company', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/company')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/company')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /cores', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/cores')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/cores')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /cores/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/cores/serial/Merlin1A')
            .then((response) => {
                let serialValue = response.data.core.serial;
                expect(Boolean(serialValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus core serial', () => {
        return axios.get('http://localhost:8000/cores/serial/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching cores.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /crew', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/crew')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/crew')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /dragons', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/dragons')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/dragons')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /dragons/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/dragons/name/Dragon 2')
            .then((response) => {
                let nameValue = response.data.dragon.name;
                expect(Boolean(nameValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus dragon name', () => {
        return axios.get('http://localhost:8000/dragons/name/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching dragons.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /history', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/history')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/history')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /landpads', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/landpads')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/landpads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /landpads/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/landpads/id/5e9e3032383ecb267a34e7c7')
            .then((response) => {
                let idValue = response.data.landpad.id;
                expect(Boolean(idValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus landpad id', () => {
        return axios.get('http://localhost:8000/landpads/id/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching landpads.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /launches', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/launches')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/launches')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /launches/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/launches/name/DemoSat')
            .then((response) => {
                let nameValue = response.data.launch.name;
                expect(Boolean(nameValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus launch name', () => {
        return axios.get('http://localhost:8000/launches/name/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching launches.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /launchpads', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/launchpads')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/launchpads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /launchpads/*', () => {
    it('response should not be undefined', () => {
        return axios.get('http://localhost:8000/launchpads/region/California')
            .then((response) => {
                let regionValue = response.data.launchpad.region;
                // console.log(regionValue);
                expect(Boolean(regionValue)).toBe(true);
            })
            .catch((error) => {
                console.log(error);
            });
    });

    it('should return not found for bogus launchpad region', () => {
        return axios.get('http://localhost:8000/launchpads/region/C99')
            .then((response) => {
                expect(response.data.message).toBe('No matching launchpads.');
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

describe('GET /payloads', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/payloads')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/payloads')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /roadster', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/roadster')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/roadster')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /rockets', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/rockets')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/rockets')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /ships', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/ships')
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/ships')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
});

describe('GET /starlink', () => {
    it('respond with 200', (done) => {
        request(app)
            .get('/starlink')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });
    });
    
    it('should respond with json', (done) => {
        request(app)
            .get('/starlink')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((error, response) => {
                if(error) {
                    done.fail(error);
                } else {
                    done();
                }
            });

    });
});

afterAll((done) => {
    server.close(done); // close the server when all tests have completed
});