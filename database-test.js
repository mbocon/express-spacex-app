const { member, capsule, ship } = require('./models');

// create our first member
// member.create({
//     name: 'Mikey Allred',
//     status: 'active',
//     agency: 'Roscosmos',
//     image: 'https://ca.slack-edge.com/T0351JZQ0-U04N45Z9HQU-d096d6d73dee-512',
//     wikipedia: 'http://wikipedia.com'
// })
// .then(createdMember => {
//     console.log('RAW CREATED MEMBER', createdMember);
//     console.log('CLEAN MEMBER', createdMember.toJSON());
// });

// read a member in database
// member.findOne({
//     where: {name: 'Mikey Allred'}
// })
// .then(foundMember=>{
//     console.log(foundMember.toJSON());
// })
// .catch(err => console.log('Error', err));

// find or create a member
// member.findOrCreate({
//     where: {
//         name: 'Ethan Paiva'
//     },
//     defaults: {
//         status: 'active',
//         agency: 'Roscosmos',
//         image: 'https://ca.slack-edge.com/T0351JZQ0-U04MV3X1K46-e0b0baa58e91-512',
//         wikipedia: 'http://wikipedia.com'
//     }
// })
// .then(([member, created]) => {
//     console.log('created?', created);
//     console.log(member.toJSON());
// })
// .catch(err => console.log('Error', err));

// find all members
// member.findAll()
// .then(members => {

//     // clean the data
//     cleanedMembers = members.map(member => member.toJSON());
//     console.log('CLEANED MEMBERS ARRAY', cleanedMembers);
// })
// .catch(err => console.log('Error', err));

// find all members with stats: 'active'
// member.findAll({
//     where: { status: 'active' }
// })
// .then(members => {
//     // clean the data
//     cleanedMembers = members.map(member => member.toJSON());
//     console.log('CLEANED MEMBERS ARRAY', cleanedMembers);
// })
// .catch(err => console.log('Error', err));

// update
// member.update(
//     { status: 'unknown' },
//     { where: { status: 'active' } }
// )
// .then(numRowsChanged=>{
//     console.log(numRowsChanged)
// })
// .catch(err => console.log('Error', err));

// destroy
// member.destroy({
//     where: { name: 'Ethan Paiva' }
// })
// .then(numRowsDeleted => {
//     console.log(numRowsDeleted);
// })
// .catch(err => console.log('Error', err));

// find all capsules
// capsule.findAll()
// .then(capsules => {
//     cleanedCapsules = capsules.map(capsule => capsule.toJSON());
//     console.log('CLEANED CAPSULES', cleanedCapsules);
// });

// create a ship
// ship.create({
//     name: 'GO Pursuit',
//     legacy_id: 'GOPURSUIT',
//     model: null,
//     type: 'Cargo',
//     active: false,
//     imo: 9458884,
//     mmsi: 367191410,
//     abs: 1201189,
//     class: 7174230,
//     mass_kg: 502999,
//     year_built: 2007,
//     home_port: 'Port Canaveral',
//     status: '',
//     speed_kn: null,
//     course_deg: null,
//     latitude: null,
//     last_ais_update: null,
//     link: 'https://www.marinetraffic.com/en/ais/details/ships/shipid:439594/mmsi:367191410/imo:9458884/vessel:GO_PURSUIT',
//     image: 'https://i.imgur.com/5w1ZWre.jpg' 
// })
// .then(createdShip => {
//     console.log(createdShip.toJSON());
// })
// .catch(err => console.log('Error', err));

// read a member in database
// ship.findOne({
//     where: { name: 'GO Pursuit' }
// })
// .then(foundShip=>{
//     console.log(foundShip.toJSON());
// })
// .catch(err => console.log('Error', err));

// find or create a member
// ship.findOrCreate({
//     where: {
//         name: 'Betty R Gambarella'
//     },
//     defaults: {
//         legacy_id: 'BETTYRCAMBARELLA',
//         model: null,
//         type: 'Tug',
//         active: false,
//         imo: 7517478,
//         mmsi: 368000890,
//         abs: 562590,
//         class: 7427463,
//         mass_kg: 202302,
//         year_built: 1974,
//         home_port: 'Port of Los Angeles',
//         status: '',
//         speed_kn: null,
//         course_deg: null,
//         latitude: null,
//         last_ais_update: null,
//         link: 'https://www.marinetraffic.com/en/ais/details/ships/shipid:1190856/mmsi:368000890/imo:7517478/vessel:BETTY_R_GAMBARELLA',
//         image: 'https://i.imgur.com/ngYgFnn.jpg' 
//     }
// })
// .then(([ship, created]) => {
//     console.log('created?', created);
//     console.log(ship.toJSON());
// })
// .catch(err => console.log('Error', err));

// find all ships
// ship.findAll()
// .then(ships => {

//     // clean the data
//     cleanedShips = ships.map(ship => ship.toJSON());
//     console.log('CLEANED SHIPS ARRAY', cleanedShips);
// })
// .catch(err => console.log('Error', err));

// read a member in database
// ship.findOne({
//     where: { legacy_id: 'GOPURSUIT' }
// })
// .then(foundShip=>{
//     console.log(foundShip.toJSON());
// })
// .catch(err => console.log('Error', err));

// update
// ship.update(
//     { name: 'UR MUM' },
//     { where: { type: 'Cargo' } }
// )
// .then(numRowsChanged=>{
//     console.log(numRowsChanged)
// })
// .catch(err => console.log('Error', err));

// destroy
// ship.destroy({
//     where: { name: 'UR MUM' }
// })
// .then(numRowsDeleted => {
//     console.log(numRowsDeleted);
// })
// .catch(err => console.log('Error', err));