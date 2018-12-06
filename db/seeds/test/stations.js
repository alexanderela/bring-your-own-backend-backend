const { mockCafes, mockStations } = require('../../../utils/seedMocks')

const createStations = (knex, station) => {
  const {
    station_name,
    station_phone,
    latitude,
    longitude,
    street_address,
    city,
    state,
    zip_code,
    intersection_directions,
    access_days_time
  } = station

  return knex('stations').insert({
    station_name,
    station_phone,
    latitude,
    longitude,
    street_address,
    city,
    state,
    zip_code,
    intersection_directions,
    access_days_time
  }, 'id')
  .then(stationIds => {
    let cafesPromises = station.cafes.map(cafe => {
      return createCafe(knex, {
        ...cafe,
        station_id: stationIds[0]
      })
    })

    return Promise.all(cafesPromises)
  })
}

const createCafe = (knex, cafe) => {
  return knex('cafes').insert(cafe)
}

exports.seed = function(knex, Promise) {
  return knex('cafes').del()
    .then(() => knex('stations').del())
    .then(() => {
      let stationPromises = mockStations.map(station => {
        return createStations(knex, station);
      })

      return Promise.all(stationPromises)
    })
    .then(() => console.log('Successfully seeded db!'))
    .catch(error => console.log(`Error seeding db: ${error.message}`))
};